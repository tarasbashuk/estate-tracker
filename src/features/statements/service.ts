import {
  Currency,
  Prisma,
  StatementItemType,
  StatementStatus,
} from '@/generated/prisma/client';

import { db } from '@/lib/db';
import { createStatementPaymentReminders } from '@/features/reminders/service';
import type { CreateStatementFormValues } from './schemas';

export async function listMonthlyStatements(userId: string) {
  return db.monthlyStatement.findMany({
    where: { userId },
    include: {
      property: true,
      tenant: true,
      items: true,
      payments: true,
    },
    orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
  });
}

export async function getMonthlyStatement(userId: string, statementId: string) {
  return db.monthlyStatement.findFirst({
    where: {
      id: statementId,
      userId,
    },
    include: {
      property: true,
      tenant: true,
      rentalAgreement: true,
      items: {
        include: {
          utilityType: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
      payments: {
        orderBy: [{ paidAt: 'desc' }, { createdAt: 'desc' }],
      },
    },
  });
}

export async function createMonthlyStatement(
  userId: string,
  values: CreateStatementFormValues,
) {
  await assertPropertyBelongsToUser(userId, values.propertyId);

  const agreement = await db.rentalAgreement.findFirst({
    where: {
      userId,
      propertyId: values.propertyId,
      status: 'ACTIVE',
    },
    select: {
      id: true,
      tenantId: true,
      monthlyRentAmount: true,
      monthlyRentCurrency: true,
    },
  });

  if (!agreement) {
    throw new Error('Property does not have an active rental agreement.');
  }

  const utilityConfigs = await db.propertyUtilityConfig.findMany({
    where: {
      userId,
      propertyId: values.propertyId,
      isEnabled: true,
    },
    include: {
      utilityType: true,
    },
    orderBy: [{ utilityType: { name: 'asc' } }],
  });

  const statement = await db.monthlyStatement.create({
    data: {
      userId,
      propertyId: values.propertyId,
      rentalAgreementId: agreement.id,
      tenantId: agreement.tenantId,
      periodMonth: values.periodMonth,
      periodYear: values.periodYear,
      dueDate: dateOnly(values.dueDate),
      status: values.status as StatementStatus,
      notes: emptyToNull(values.notes),
      items: {
        create: [
          {
            userId,
            itemType: StatementItemType.RENT,
            label: 'Rent',
            amount: agreement.monthlyRentAmount,
            currency: agreement.monthlyRentCurrency as Currency,
            sortOrder: 0,
          },
          ...utilityConfigs.map((config, index) => ({
            userId,
            utilityTypeId: config.utilityTypeId,
            itemType: StatementItemType.UTILITY,
            label: config.utilityType.name,
            amount:
              config.defaultAmount ?? new Prisma.Decimal(0),
            currency: Currency.UAH,
            sortOrder: index + 1,
            notes: config.notes,
          })),
        ],
      },
    },
  });

  await createStatementPaymentReminders(userId, statement.id);

  return statement;
}

export function calculateStatementTotal(
  items: { amount: Prisma.Decimal | number | string }[],
) {
  return items.reduce(
    (total, item) => total.plus(item.amount.toString()),
    new Prisma.Decimal(0),
  );
}

async function assertPropertyBelongsToUser(userId: string, propertyId: string) {
  const property = await db.property.findFirst({
    where: {
      id: propertyId,
      userId,
      isArchived: false,
    },
    select: { id: true },
  });

  if (!property) {
    throw new Error('Property not found.');
  }
}

function dateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function emptyToNull(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}
