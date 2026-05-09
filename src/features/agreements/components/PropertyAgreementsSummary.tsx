import Link from 'next/link';
import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import type { Prisma } from '@/generated/prisma/client';

import { AddAgreementDialogButton } from './AddAgreementDialogButton';
import { AgreementStatusChip } from './AgreementStatusChip';
import type {
  AgreementPropertyOption,
  AgreementTenantOption,
} from './RentalAgreementForm';

type PropertyAgreement = Prisma.RentalAgreementGetPayload<{
  include: { tenant: true };
}>;

export function PropertyAgreementsSummary({
  agreements,
  property,
  tenants,
}: {
  agreements: PropertyAgreement[];
  property: AgreementPropertyOption;
  tenants: AgreementTenantOption[];
}) {
  const activeAgreement = agreements.find(
    (agreement) => agreement.status === 'ACTIVE',
  );
  const history = agreements.filter((agreement) => agreement.status !== 'ACTIVE');

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
              Rental agreements
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active agreement and history for this property.
            </Typography>
          </Stack>
          <AddAgreementDialogButton
            properties={[property]}
            tenants={tenants}
            defaultValues={{ propertyId: property.id }}
          />
        </Stack>

        <Divider />

        {activeAgreement ? (
          <AgreementLine agreement={activeAgreement} />
        ) : (
          <Typography color="text.secondary">
            No active agreement for this property.
          </Typography>
        )}

        {history.length > 0 ? (
          <Stack spacing={1}>
            <Typography variant="subtitle2">History</Typography>
            {history.map((agreement) => (
              <AgreementLine key={agreement.id} agreement={agreement} />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}

function AgreementLine({ agreement }: { agreement: PropertyAgreement }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
    >
      <Stack spacing={0.25}>
        <Link href={`/agreements/${agreement.id}`}>
          <Button sx={{ p: 0, minWidth: 0, textTransform: 'none' }}>
            {agreement.tenant.fullName}
          </Button>
        </Link>
        <Typography variant="body2" color="text.secondary">
          {agreement.monthlyRentAmount.toString()} {agreement.monthlyRentCurrency}
          {' · '}due day {agreement.paymentDueDay}
        </Typography>
      </Stack>
      <AgreementStatusChip status={agreement.status} />
    </Stack>
  );
}
