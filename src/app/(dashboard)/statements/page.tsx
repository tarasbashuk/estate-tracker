import { Stack, Typography } from '@mui/material';

import { AddStatementDialogButton } from '@/features/statements/components/AddStatementDialogButton';
import { StatementList } from '@/features/statements/components/StatementList';
import { listMonthlyStatements } from '@/features/statements/service';
import { listProperties } from '@/features/properties/service';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function StatementsPage() {
  const user = await requireUser();
  const [statements, properties] = await Promise.all([
    listMonthlyStatements(user.id),
    listProperties(user.id),
  ]);
  const propertyOptions = properties.map((property) => ({
    id: property.id,
    name: property.name,
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
            Monthly statements
          </Typography>
          <Typography color="text.secondary">
            Create tenant-facing monthly summaries from agreements and utilities.
          </Typography>
        </Stack>
        <AddStatementDialogButton properties={propertyOptions} />
      </Stack>

      <StatementList statements={statements} />
    </Stack>
  );
}
