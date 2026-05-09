'use client';

import { Alert, Button, Stack, Typography } from '@mui/material';

export default function AgreementsError({ reset }: { reset: () => void }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Rental agreements
      </Typography>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={reset}>
            Retry
          </Button>
        }
      >
        Unable to load rental agreements.
      </Alert>
    </Stack>
  );
}

