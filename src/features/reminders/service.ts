import { ReminderStatus, ReminderType } from '@/generated/prisma/client';

import { db } from '@/lib/db';
import type { ReminderFormValues } from './schemas';

export async function listOpenReminders(userId: string, take = 20) {
  return db.reminder.findMany({
    where: {
      userId,
      status: ReminderStatus.OPEN,
    },
    include: {
      property: true,
      tenant: true,
      monthlyStatement: true,
      meter: true,
    },
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'asc' }],
    take,
  });
}

export async function listAllReminders(userId: string) {
  return db.reminder.findMany({
    where: { userId },
    include: {
      property: true,
      tenant: true,
      monthlyStatement: true,
      meter: true,
    },
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function createReminder(
  userId: string,
  values: ReminderFormValues,
) {
  await assertOptionalRelationsBelongToUser(userId, values);

  return db.reminder.create({
    data: {
      userId,
      type: values.type as ReminderType,
      title: values.title.trim(),
      description: emptyToNull(values.description),
      dueDate: dateOnly(values.dueDate),
      propertyId: emptyToNull(values.propertyId),
      tenantId: emptyToNull(values.tenantId),
      monthlyStatementId: emptyToNull(values.monthlyStatementId),
      meterId: emptyToNull(values.meterId),
    },
  });
}

export async function updateReminderStatus(
  userId: string,
  reminderId: string,
  status: ReminderStatus,
) {
  const reminder = await db.reminder.findFirst({
    where: { id: reminderId, userId },
    select: { id: true },
  });

  if (!reminder) {
    throw new Error('Reminder not found.');
  }

  return db.reminder.update({
    where: {
      id: reminderId,
      userId,
    },
    data: {
      status,
      completedAt: status === ReminderStatus.DONE ? new Date() : null,
    },
  });
}

export async function createStatementPaymentReminders(
  userId: string,
  monthlyStatementId: string,
) {
  const statement = await db.monthlyStatement.findFirst({
    where: { id: monthlyStatementId, userId },
    include: {
      property: true,
      tenant: true,
      items: true,
    },
  });

  if (!statement) {
    throw new Error('Statement not found.');
  }

  const period = `${statement.periodMonth}/${statement.periodYear}`;
  let createdCount = 0;
  const rentReminder = await createReminderIfMissing({
    userId,
    type: ReminderType.RENT_PAYMENT_DUE,
    title: `Rent payment due: ${statement.property.name} ${period}`,
    description: `Follow up with ${statement.tenant.fullName} about rent payment.`,
    dueDate: statement.dueDate,
    propertyId: statement.propertyId,
    tenantId: statement.tenantId,
    monthlyStatementId: statement.id,
  });

  if (rentReminder) createdCount += 1;

  const hasUtilityItems = statement.items.some(
    (item) => item.itemType === 'UTILITY',
  );

  if (hasUtilityItems) {
    const utilityReminder = await createReminderIfMissing({
      userId,
      type: ReminderType.UTILITIES_PAYMENT_DUE,
      title: `Utilities payment due: ${statement.property.name} ${period}`,
      description: `Follow up with ${statement.tenant.fullName} about utilities payment.`,
      dueDate: statement.dueDate,
      propertyId: statement.propertyId,
      tenantId: statement.tenantId,
      monthlyStatementId: statement.id,
    });

    if (utilityReminder) createdCount += 1;
  }

  return createdCount;
}

export async function createMeterOperationalReminders(
  userId: string,
  meterId: string,
  periodDate = new Date(),
) {
  const meter = await db.meter.findFirst({
    where: {
      id: meterId,
      userId,
      isActive: true,
    },
    include: {
      property: true,
      utilityType: true,
    },
  });

  if (!meter) return 0;

  const month = periodDate.getMonth() + 1;
  const year = periodDate.getFullYear();
  const period = `${month}/${year}`;
  const requestDueDate = makeDate(
    year,
    month,
    meter.submissionDayStart ? Math.max(1, meter.submissionDayStart - 2) : 20,
  );
  const submissionDueDate = makeDate(
    year,
    month,
    meter.submissionDayEnd ?? meter.submissionDayStart ?? 25,
  );
  let createdCount = 0;
  const requestReminder = await createReminderIfMissing({
    userId,
    type: ReminderType.REQUEST_METER_READINGS_FROM_TENANT,
    title: `Request meter reading: ${meter.name} ${period}`,
    description: `Ask tenant for ${meter.utilityType.name} reading at ${meter.property.name}.`,
    dueDate: requestDueDate,
    propertyId: meter.propertyId,
    meterId: meter.id,
  });

  if (requestReminder) createdCount += 1;

  const submissionReminder = await createReminderIfMissing({
    userId,
    type: ReminderType.SUBMIT_METER_READINGS_TO_PROVIDER,
    title: `Submit meter reading: ${meter.name} ${period}`,
    description: `Submit ${meter.utilityType.name} reading for ${meter.property.name}.`,
    dueDate: submissionDueDate,
    propertyId: meter.propertyId,
    meterId: meter.id,
  });

  if (submissionReminder) createdCount += 1;

  return createdCount;
}

export async function generateAutomaticReminders(userId: string) {
  const [statements, meters] = await Promise.all([
    db.monthlyStatement.findMany({
      where: { userId, status: { not: 'CANCELLED' } },
      select: { id: true },
    }),
    db.meter.findMany({
      where: { userId, isActive: true },
      select: { id: true },
    }),
  ]);
  let createdCount = 0;

  for (const statement of statements) {
    createdCount += await createStatementPaymentReminders(userId, statement.id);
  }

  for (const meter of meters) {
    createdCount += await createMeterOperationalReminders(userId, meter.id);
  }

  return createdCount;
}

export function isReminderOverdue(dueDate: Date) {
  const today = new Date();
  const todayOnly = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const dueOnly = new Date(
    Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()),
  );

  return dueOnly < todayOnly;
}

async function createReminderIfMissing({
  userId,
  type,
  title,
  description,
  dueDate,
  propertyId,
  tenantId,
  monthlyStatementId,
  meterId,
}: {
  userId: string;
  type: ReminderType;
  title: string;
  description: string;
  dueDate: Date;
  propertyId?: string;
  tenantId?: string;
  monthlyStatementId?: string;
  meterId?: string;
}) {
  const existing = await db.reminder.findFirst({
    where: {
      userId,
      type,
      dueDate,
      propertyId: propertyId ?? null,
      tenantId: tenantId ?? null,
      monthlyStatementId: monthlyStatementId ?? null,
      meterId: meterId ?? null,
    },
    select: { id: true },
  });

  if (existing) return null;

  return db.reminder.create({
    data: {
      userId,
      type,
      title,
      description,
      dueDate,
      propertyId: propertyId ?? null,
      tenantId: tenantId ?? null,
      monthlyStatementId: monthlyStatementId ?? null,
      meterId: meterId ?? null,
    },
    select: { id: true },
  });
}

function makeDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day));
}

async function assertOptionalRelationsBelongToUser(
  userId: string,
  values: ReminderFormValues,
) {
  const [property, tenant, statement, meter] = await Promise.all([
    values.propertyId
      ? db.property.findFirst({
          where: { id: values.propertyId, userId, isArchived: false },
          select: { id: true },
        })
      : null,
    values.tenantId
      ? db.tenant.findFirst({
          where: { id: values.tenantId, userId, isArchived: false },
          select: { id: true },
        })
      : null,
    values.monthlyStatementId
      ? db.monthlyStatement.findFirst({
          where: { id: values.monthlyStatementId, userId },
          select: { id: true },
        })
      : null,
    values.meterId
      ? db.meter.findFirst({
          where: { id: values.meterId, userId },
          select: { id: true },
        })
      : null,
  ]);

  if (values.propertyId && !property) throw new Error('Property not found.');
  if (values.tenantId && !tenant) throw new Error('Tenant not found.');
  if (values.monthlyStatementId && !statement) {
    throw new Error('Statement not found.');
  }
  if (values.meterId && !meter) throw new Error('Meter not found.');
}

function dateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function emptyToNull(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}
