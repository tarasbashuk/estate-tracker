import { Stack, Typography } from '@mui/material';

import { listMeters } from '@/features/meters/service';
import { listProperties } from '@/features/properties/service';
import { AddReminderDialogButton } from '@/features/reminders/components/AddReminderDialogButton';
import { ReminderList } from '@/features/reminders/components/ReminderList';
import { listAllReminders } from '@/features/reminders/service';
import { listMonthlyStatements } from '@/features/statements/service';
import { listTenants } from '@/features/tenants/service';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function RemindersPage() {
  const user = await requireUser();
  const [reminders, properties, tenants, statements, meters] =
    await Promise.all([
      listAllReminders(user.id),
      listProperties(user.id),
      listTenants(user.id),
      listMonthlyStatements(user.id),
      listMeters(user.id),
    ]);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4" component="h1">
            Reminders
          </Typography>
          <Typography color="text.secondary">
            Internal tasks for readings, provider submissions, payments, and
            custom follow-ups.
          </Typography>
        </Stack>
        <AddReminderDialogButton
          properties={properties.map((property) => ({
            id: property.id,
            label: property.name,
          }))}
          tenants={tenants.map((tenant) => ({
            id: tenant.id,
            label: tenant.fullName,
          }))}
          statements={statements.map((statement) => ({
            id: statement.id,
            label: `${statement.property.name} ${statement.periodMonth}/${statement.periodYear}`,
          }))}
          meters={meters.map((meter) => ({
            id: meter.id,
            label: `${meter.property.name} · ${meter.name}`,
          }))}
        />
      </Stack>

      <ReminderList reminders={reminders} />
    </Stack>
  );
}
