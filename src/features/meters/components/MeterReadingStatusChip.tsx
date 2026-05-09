import { Chip } from '@mui/material';
import type { MeterReadingStatus } from '@/generated/prisma/client';

const statusLabels: Record<MeterReadingStatus, string> = {
  WAITING_FOR_TENANT: 'Waiting',
  RECEIVED_FROM_TENANT: 'Received',
  SUBMITTED_TO_PROVIDER: 'Submitted',
  NOT_REQUIRED: 'Not required',
};

const statusColors: Record<
  MeterReadingStatus,
  'default' | 'info' | 'success' | 'warning'
> = {
  WAITING_FOR_TENANT: 'warning',
  RECEIVED_FROM_TENANT: 'info',
  SUBMITTED_TO_PROVIDER: 'success',
  NOT_REQUIRED: 'default',
};

export function MeterReadingStatusChip({
  status,
}: {
  status: MeterReadingStatus;
}) {
  return (
    <Chip
      label={statusLabels[status]}
      color={statusColors[status]}
      size="small"
      variant="outlined"
    />
  );
}
