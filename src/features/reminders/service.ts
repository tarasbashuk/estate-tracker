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
