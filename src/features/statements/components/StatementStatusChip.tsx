import { Chip } from '@mui/material';
import type { StatementStatus } from '@/generated/prisma/client';

const labels: Record<StatementStatus, string> = {
  DRAFT: 'Draft',
  READY_TO_SEND: 'Ready',
  SENT: 'Sent',
  CANCELLED: 'Cancelled',
};

const colors: Record<
  StatementStatus,
  'default' | 'info' | 'success' | 'warning'
> = {
  DRAFT: 'default',
  READY_TO_SEND: 'info',
  SENT: 'success',
  CANCELLED: 'warning',
};

export function StatementStatusChip({ status }: { status: StatementStatus }) {
  return (
    <Chip label={labels[status]} color={colors[status]} size="small" variant="outlined" />
  );
}
