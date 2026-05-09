import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Prisma } from '@/generated/prisma/client';

import { EmptyState } from '@/components/feedback/EmptyState';
import { isReminderOverdue } from '@/features/reminders/service';
import { ReminderActions } from './ReminderActions';
import { ReminderStatusChip } from './ReminderStatusChip';

type ReminderListItem = Prisma.ReminderGetPayload<{
  include: {
    property: true;
    tenant: true;
    monthlyStatement: true;
    meter: true;
  };
}>;

export function ReminderList({
  reminders,
  emptyTitle = 'No reminders',
  emptyDescription = 'Create reminders for meter readings, payments, and operational tasks.',
}: {
  reminders: ReminderListItem[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (reminders.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reminder</TableCell>
            <TableCell>Due</TableCell>
            <TableCell>Context</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reminders.map((reminder) => (
            <TableRow key={reminder.id} hover>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography sx={{ fontWeight: 600 }}>
                    {reminder.title}
                  </Typography>
                  {reminder.description ? (
                    <Typography variant="body2" color="text.secondary">
                      {reminder.description}
                    </Typography>
                  ) : null}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography>{reminder.dueDate.toLocaleDateString()}</Typography>
                  {reminder.status === 'OPEN' &&
                  isReminderOverdue(reminder.dueDate) ? (
                    <Typography variant="body2" color="error">
                      Overdue
                    </Typography>
                  ) : null}
                </Stack>
              </TableCell>
              <TableCell>{formatContext(reminder)}</TableCell>
              <TableCell>
                <ReminderStatusChip status={reminder.status} />
              </TableCell>
              <TableCell align="right">
                {reminder.status === 'OPEN' ? (
                  <ReminderActions reminderId={reminder.id} />
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function formatContext(reminder: ReminderListItem) {
  const parts = [
    reminder.property?.name,
    reminder.tenant?.fullName,
    reminder.monthlyStatement
      ? `${reminder.monthlyStatement.periodMonth}/${reminder.monthlyStatement.periodYear}`
      : null,
    reminder.meter?.name,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : '-';
}
