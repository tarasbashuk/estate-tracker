import type { Prisma } from '@/generated/prisma/client';

import { calculatePaidAmount } from '@/features/payments/service';
import { calculateStatementTotal } from './service';

type TenantSummaryStatement = {
  periodMonth: number;
  periodYear: number;
  dueDate: Date;
  property: {
    name: string;
    addressLine1: string;
    city: string;
  };
  tenant: {
    fullName: string;
  };
  items: {
    label: string;
    amount: Prisma.Decimal;
    currency: string;
  }[];
  payments: {
    amount: Prisma.Decimal;
    currency: string;
  }[];
};

export function getTenantStatementTotals(statement: TenantSummaryStatement) {
  const total = calculateStatementTotal(statement.items);
  const paid = calculatePaidAmount(statement.payments);
  const remaining = total.minus(paid);

  return { total, paid, remaining };
}

export function generateTenantStatementMessage(
  statement: TenantSummaryStatement,
) {
  const { total, paid, remaining } = getTenantStatementTotals(statement);
  const itemLines = statement.items
    .map((item) => `- ${item.label}: ${item.amount.toString()} ${item.currency}`)
    .join('\n');

  return [
    `Hello ${statement.tenant.fullName},`,
    '',
    `Monthly statement for ${statement.property.name}, ${statement.periodMonth}/${statement.periodYear}:`,
    itemLines,
    '',
    `Total: ${total.toString()} UAH`,
    `Paid: ${paid.toString()} UAH`,
    `Remaining: ${remaining.toString()} UAH`,
    `Due date: ${statement.dueDate.toLocaleDateString()}`,
    '',
    'Thank you.',
  ].join('\n');
}
