import { Divider, Paper, Stack, Typography } from '@mui/material';
import type { Prisma } from '@/generated/prisma/client';

import {
  calculatePaidAmount,
  derivePaymentStatus,
} from '@/features/payments/service';
import { calculateStatementTotal } from '@/features/statements/service';
import { AddPaymentDialogButton } from './AddPaymentDialogButton';
import { PaymentStatusChip } from './PaymentStatusChip';

type PaymentSummaryStatement = {
  id: string;
  dueDate: Date;
  status: string;
  items: { amount: Prisma.Decimal }[];
  payments: { amount: Prisma.Decimal }[];
};

export function PaymentSummary({
  statement,
}: {
  statement: PaymentSummaryStatement;
}) {
  const total = calculateStatementTotal(statement.items);
  const paid = calculatePaidAmount(statement.payments);
  const remaining = total.minus(paid);
  const status = derivePaymentStatus({
    totalAmount: total,
    paidAmount: paid,
    dueDate: statement.dueDate,
    statementStatus: statement.status,
  });

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" component="h2">
              Payments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paid amount and partial status are derived from payment totals.
            </Typography>
          </Stack>
          <AddPaymentDialogButton monthlyStatementId={statement.id} />
        </Stack>
        <Divider />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Amount label="Expected" value={total.toString()} />
          <Amount label="Paid" value={paid.toString()} />
          <Amount label="Remaining" value={remaining.toString()} />
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <PaymentStatusChip status={status} />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

function Amount({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 700 }}>{value} UAH</Typography>
    </Stack>
  );
}
