'use client';

import { useTransition } from 'react';
import { Button, Stack } from '@mui/material';

import {
  cancelReminderAction,
  markReminderDoneAction,
  skipReminderAction,
} from '@/app/actions/reminders';

export function ReminderActions({ reminderId }: { reminderId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
      <Button
        size="small"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await markReminderDoneAction(reminderId);
          })
        }
      >
        Done
      </Button>
      <Button
        size="small"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await skipReminderAction(reminderId);
          })
        }
      >
        Skip
      </Button>
      <Button
        size="small"
        color="error"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await cancelReminderAction(reminderId);
          })
        }
      >
        Cancel
      </Button>
    </Stack>
  );
}
