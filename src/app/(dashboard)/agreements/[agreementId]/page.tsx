import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { AgreementStatusChip } from '@/features/agreements/components/AgreementStatusChip';
import { CancelAgreementButton } from '@/features/agreements/components/CancelAgreementButton';
import { EditAgreementForm } from '@/features/agreements/components/EditAgreementForm';
import { getRentalAgreement } from '@/features/agreements/service';
import type { RentalAgreementFormValues } from '@/features/agreements/schemas';
import { listProperties } from '@/features/properties/service';
import { listTenants } from '@/features/tenants/service';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function AgreementDetailsPage({
  params,
}: {
  params: Promise<{ agreementId: string }>;
}) {
  const { agreementId } = await params;
  const user = await requireUser();
  const [agreement, properties, tenants] = await Promise.all([
    getRentalAgreement(user.id, agreementId),
    listProperties(user.id),
    listTenants(user.id),
  ]);

  if (!agreement) {
    notFound();
  }

  const formDefaults: RentalAgreementFormValues = {
    propertyId: agreement.propertyId,
    tenantId: agreement.tenantId,
    startDate: toDateInputValue(agreement.startDate),
    endDate: agreement.endDate ? toDateInputValue(agreement.endDate) : '',
    status: agreement.status,
    monthlyRentAmount: agreement.monthlyRentAmount.toNumber(),
    monthlyRentCurrency: agreement.monthlyRentCurrency,
    paymentDueDay: agreement.paymentDueDay,
    depositAmount: agreement.depositAmount
      ? agreement.depositAmount.toNumber()
      : undefined,
    depositCurrency: agreement.depositCurrency,
    notes: agreement.notes ?? '',
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack spacing={1}>
          <Link href="/agreements">
            <Button sx={{ alignSelf: 'flex-start', p: 0, minWidth: 0 }}>
              Back to agreements
            </Button>
          </Link>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              {agreement.property.name}
            </Typography>
            <AgreementStatusChip status={agreement.status} />
          </Stack>
          <Typography color="text.secondary">
            {agreement.tenant.fullName}
          </Typography>
        </Stack>
        <CancelAgreementButton agreementId={agreement.id} />
      </Stack>

      <Paper
        elevation={0}
        sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Overview
          </Typography>
          <Divider />
          <DetailRow label="Property" value={agreement.property.name} />
          <DetailRow label="Tenant" value={agreement.tenant.fullName} />
          <DetailRow label="Start date" value={formatDate(agreement.startDate)} />
          <DetailRow
            label="End date"
            value={agreement.endDate ? formatDate(agreement.endDate) : null}
          />
          <DetailRow
            label="Monthly rent"
            value={`${agreement.monthlyRentAmount.toString()} ${
              agreement.monthlyRentCurrency
            }`}
          />
          <DetailRow
            label="Deposit"
            value={
              agreement.depositAmount
                ? `${agreement.depositAmount.toString()} ${
                    agreement.depositCurrency
                  }`
                : null
            }
          />
          <DetailRow
            label="Payment due day"
            value={agreement.paymentDueDay.toString()}
          />
          <DetailRow label="Notes" value={agreement.notes} />
        </Stack>
      </Paper>

      <EditAgreementForm
        agreementId={agreement.id}
        properties={properties}
        tenants={tenants}
        defaultValues={formDefaults}
      />
    </Stack>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{ justifyContent: 'space-between' }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: 500 }}>{value || '-'}</Typography>
    </Stack>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString();
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

