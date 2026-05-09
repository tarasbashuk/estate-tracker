import { Chip } from '@mui/material';
import type { ReminderStatus } from '@/generated/prisma/client';

const labels: Record<ReminderStatus, string> = {
  OPEN: 'Open',
  DONE: 'Done',
  SKIPPED: 'Skipped',
  CANCELLED: 'Cancelled',
};

const colors: Record<
  ReminderStatus,
  'default' | 'error' | 'success' | 'warning'
> = {
  OPEN: 'warning',
  DONE: 'success',
  SKIPPED: 'default',
  CANCELLED: 'error',
};

export function ReminderStatusChip({ status }: { status: ReminderStatus }) {
  return <Chip label={labels[status]} color={colors[status]} size="small" variant="outlined" />;
}
