import {
  Currency,
  PaymentCategory,
  PaymentMethod,
  Prisma,
} from '@/generated/prisma/client';

import { db } from '@/lib/db';
import type { PaymentFormValues } from './schemas';

export type DerivedPaymentStatus =
  | 'UNPAID'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERPAID'
  | 'OVERDUE';

export async function createPayment(
  userId: string,
  monthlyStatementId: string,
  values: PaymentFormValues,
) {
  const statement = await db.monthlyStatement.findFirst({
    where: {
      id: monthlyStatementId,
      userId,
    },
    select: {
      id: true,
      propertyId: true,
      tenantId: true,
    },
  });

  if (!statement) {
    throw new Error('Monthly statement not found.');
  }

  return db.payment.create({
    data: {
      userId,
      monthlyStatementId,
      propertyId: statement.propertyId,
      tenantId: statement.tenantId,
      amount: new Prisma.Decimal(values.amount.toString()),
      currency: values.currency as Currency,
      category: values.category as PaymentCategory,
      method: values.method as PaymentMethod,
      paidAt: dateOnly(values.paidAt),
      notes: emptyToNull(values.notes),
    },
  });
}

export function calculatePaidAmount(
  payments: { amount: Prisma.Decimal | number | string }[],
) {
  return payments.reduce(
    (total, payment) => total.plus(payment.amount.toString()),
    new Prisma.Decimal(0),
  );
}

export function derivePaymentStatus({
  totalAmount,
  paidAmount,
  dueDate,
  statementStatus,
}: {
  totalAmount: Prisma.Decimal;
  paidAmount: Prisma.Decimal;
  dueDate: Date;
  statementStatus?: string;
}): DerivedPaymentStatus | 'CANCELLED' {
  if (statementStatus === 'CANCELLED') return 'CANCELLED';
  if (paidAmount.gt(totalAmount)) return 'OVERPAID';
  if (paidAmount.eq(totalAmount)) return 'PAID';
  if (paidAmount.gt(0)) return 'PARTIALLY_PAID';
  if (isPastDate(dueDate)) return 'OVERDUE';

  return 'UNPAID';
}

function isPastDate(date: Date) {
  const today = new Date();
  const todayOnly = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const valueOnly = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );

  return valueOnly < todayOnly;
}

function dateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function emptyToNull(value?: string) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}
