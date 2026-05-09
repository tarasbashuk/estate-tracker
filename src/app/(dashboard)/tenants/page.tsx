import { Stack, Typography } from '@mui/material';

import { AddTenantDialogButton } from '@/features/tenants/components/AddTenantDialogButton';
import { TenantList } from '@/features/tenants/components/TenantList';
import { listTenants } from '@/features/tenants/service';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function TenantsPage() {
  const user = await requireUser();
  const tenants = await listTenants(user.id);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4" component="h1">
            Tenants
          </Typography>
          <Typography color="text.secondary">
            Create and review tenant contact records owned by your account.
          </Typography>
        </Stack>
        <AddTenantDialogButton />
      </Stack>

      <TenantList tenants={tenants} />
    </Stack>
  );
}
