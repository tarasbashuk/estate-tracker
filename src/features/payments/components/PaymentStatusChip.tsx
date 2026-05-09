import { Chip } from '@mui/material';
import type { DerivedPaymentStatus } from '@/features/payments/service';

const labels: Record<DerivedPaymentStatus | 'CANCELLED', string> = {
  UNPAID: 'Unpaid',
  PARTIALLY_PAID: 'Partial',
  PAID: 'Paid',
  OVERPAID: 'Overpaid',
  OVERDUE: 'Overdue',
  CANCELLED: 'Cancelled',
};

const colors: Record<
  DerivedPaymentStatus | 'CANCELLED',
  'default' | 'error' | 'info' | 'success' | 'warning'
> = {
  UNPAID: 'default',
  PARTIALLY_PAID: 'info',
  PAID: 'success',
  OVERPAID: 'warning',
  OVERDUE: 'error',
  CANCELLED: 'default',
};

export function PaymentStatusChip({
  status,
}: {
  status: DerivedPaymentStatus | 'CANCELLED';
}) {
  return (
    <Chip
      label={labels[status]}
      color={colors[status]}
      size="small"
      variant="outlined"
    />
  );
}
