'use client';

import { Alert, Button, Stack } from '@mui/material';

export default function RemindersError({ reset }: { reset: () => void }) {
  return (
    <Stack spacing={2}>
      <Alert severity="error">Unable to load reminders.</Alert>
      <Button variant="outlined" onClick={reset} sx={{ alignSelf: 'flex-start' }}>
        Try again
      </Button>
    </Stack>
  );
}
