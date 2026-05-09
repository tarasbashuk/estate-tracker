import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Payment } from '@/generated/prisma/client';

import { EmptyState } from '@/components/feedback/EmptyState';

const categoryLabels: Record<Payment['category'], string> = {
  RENT: 'Rent',
  UTILITIES: 'Utilities',
  DEPOSIT: 'Deposit',
  MIXED: 'Mixed',
  OTHER: 'Other',
};

const methodLabels: Record<Payment['method'], string> = {
  BANK_TRANSFER: 'Bank transfer',
  CASH: 'Cash',
  CARD: 'Card',
  OTHER: 'Other',
};

export function PaymentHistory({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <EmptyState
        title="No payments recorded"
        description="Record received tenant payments against this statement."
      />
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Payment history
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.paidAt.toLocaleDateString()}</TableCell>
                <TableCell>{categoryLabels[payment.category]}</TableCell>
                <TableCell>{methodLabels[payment.method]}</TableCell>
                <TableCell>{payment.notes || '-'}</TableCell>
                <TableCell align="right">
                  {payment.amount.toString()} {payment.currency}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    </Paper>
  );
}
