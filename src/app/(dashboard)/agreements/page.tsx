import { Stack, Typography } from '@mui/material';

import { AddAgreementDialogButton } from '@/features/agreements/components/AddAgreementDialogButton';
import { RentalAgreementList } from '@/features/agreements/components/RentalAgreementList';
import { listRentalAgreements } from '@/features/agreements/service';
import { listProperties } from '@/features/properties/service';
import { listTenants } from '@/features/tenants/service';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function AgreementsPage() {
  const user = await requireUser();
  const [agreements, properties, tenants] = await Promise.all([
    listRentalAgreements(user.id),
    listProperties(user.id),
    listTenants(user.id),
  ]);
  const propertyOptions = properties.map((property) => ({
    id: property.id,
    name: property.name,
  }));
  const tenantOptions = tenants.map((tenant) => ({
    id: tenant.id,
    fullName: tenant.fullName,
  }));

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4" component="h1">
            Rental agreements
          </Typography>
          <Typography color="text.secondary">
            Connect properties and tenants with rent and payment terms.
          </Typography>
        </Stack>
        <AddAgreementDialogButton
          properties={propertyOptions}
          tenants={tenantOptions}
        />
      </Stack>

      <RentalAgreementList agreements={agreements} />
    </Stack>
  );
}
