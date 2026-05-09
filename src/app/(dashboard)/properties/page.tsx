import { Stack, Typography } from '@mui/material';

import { AddPropertyDialogButton } from '@/features/properties/components/AddPropertyDialogButton';
import { PropertyList } from '@/features/properties/components/PropertyList';
import { listProperties } from '@/features/properties/service';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
  const user = await requireUser();
  const properties = await listProperties(user.id);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4" component="h1">
            Properties
          </Typography>
          <Typography color="text.secondary">
            Create and review rental properties owned by your account.
          </Typography>
        </Stack>
        <AddPropertyDialogButton />
      </Stack>

      <PropertyList properties={properties} />
    </Stack>
  );
}
