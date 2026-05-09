import { Chip } from '@mui/material';
import type { AgreementStatus } from '@/generated/prisma/client';

const statusLabels: Record<AgreementStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  ENDED: 'Ended',
  CANCELLED: 'Cancelled',
};

const statusColors: Record<
  AgreementStatus,
  'default' | 'primary' | 'success' | 'warning' | 'error'
> = {
  DRAFT: 'warning',
  ACTIVE: 'success',
  ENDED: 'default',
  CANCELLED: 'error',
};

export function AgreementStatusChip({ status }: { status: AgreementStatus }) {
  return (
    <Chip
      label={statusLabels[status]}
      color={statusColors[status]}
      size="small"
      variant={status === 'ENDED' ? 'outlined' : 'filled'}
    />
  );
}

