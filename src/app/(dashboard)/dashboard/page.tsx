import Link from 'next/link';
import {
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { calculatePaidAmount } from '@/features/payments/service';
import { ReminderList } from '@/features/reminders/components/ReminderList';
import {
  isReminderOverdue,
  listOpenReminders,
} from '@/features/reminders/service';
import {
  calculateStatementTotal,
  listMonthlyStatements,
} from '@/features/statements/service';
import { listRentalAgreements } from '@/features/agreements/service';
import { listProperties } from '@/features/properties/service';
import { dictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/i18n-server';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const locale = await getLocale();
  const labels = dictionary[locale].dashboard;
  const user = await requireUser();
  const [properties, agreements, statements, reminders] = await Promise.all([
    listProperties(user.id),
    listRentalAgreements(user.id),
    listMonthlyStatements(user.id),
    listOpenReminders(user.id, 8),
  ]);
  const activeAgreements = agreements.filter(
    (agreement) => agreement.status === 'ACTIVE',
  );
  const expected = statements.reduce(
    (total, statement) => total + Number(calculateStatementTotal(statement.items)),
    0,
  );
  const received = statements.reduce(
    (total, statement) => total + Number(calculatePaidAmount(statement.payments)),
    0,
  );
  const overdueReminders = reminders.filter((reminder) =>
    isReminderOverdue(reminder.dueDate),
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" component="h1">
          {labels.title}
        </Typography>
        <Typography color="text.secondary">
          {labels.subtitle}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: 'stretch' }}
      >
        <MetricCard label={labels.activeProperties} value={properties.length} />
        <MetricCard
          label={labels.activeAgreements}
          value={activeAgreements.length}
        />
        <MetricCard
          label={labels.expectedIncome}
          value={`${expected.toFixed(2)} UAH`}
        />
        <MetricCard
          label={labels.receivedIncome}
          value={`${received.toFixed(2)} UAH`}
        />
        <MetricCard
          label={labels.overdueReminders}
          value={overdueReminders.length}
        />
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5" component="h2">
            {labels.openReminders}
          </Typography>
          <Typography color="text.secondary">
            {labels.openRemindersSubtitle}
          </Typography>
        </Stack>
        <Link href="/reminders">
          <Button variant="outlined">{labels.viewAllReminders}</Button>
        </Link>
      </Stack>

      <ReminderList
        reminders={reminders}
        emptyTitle={labels.noOpenReminders}
        emptyDescription={labels.noOpenRemindersDescription}
      />
    </Stack>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        flex: 1,
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
}
