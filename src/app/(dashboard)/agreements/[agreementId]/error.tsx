'use client';

import { Alert, Button, Stack, Typography } from '@mui/material';

export default function AgreementDetailsError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Rental agreement
      </Typography>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={reset}>
            Retry
          </Button>
        }
      >
        Unable to load this rental agreement.
      </Alert>
    </Stack>
  );
}

