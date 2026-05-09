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
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Snapshot of properties, income, and open operational tasks.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: 'stretch' }}
      >
        <MetricCard label="Active properties" value={properties.length} />
        <MetricCard label="Active agreements" value={activeAgreements.length} />
        <MetricCard label="Expected income" value={`${expected.toFixed(2)} UAH`} />
        <MetricCard label="Received income" value={`${received.toFixed(2)} UAH`} />
        <MetricCard label="Overdue reminders" value={overdueReminders.length} />
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5" component="h2">
            Open reminders
          </Typography>
          <Typography color="text.secondary">
            Upcoming and overdue work that still needs attention.
          </Typography>
        </Stack>
        <Link href="/reminders">
          <Button variant="outlined">View all reminders</Button>
        </Link>
      </Stack>

      <ReminderList
        reminders={reminders}
        emptyTitle="No open reminders"
        emptyDescription="Create reminders for readings, payment due dates, or custom tasks."
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
