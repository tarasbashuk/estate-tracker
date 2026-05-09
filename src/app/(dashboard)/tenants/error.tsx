'use client';

import { Alert, Button, Stack, Typography } from '@mui/material';

export default function TenantsError({ reset }: { reset: () => void }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Tenants
      </Typography>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={reset}>
            Retry
          </Button>
        }
      >
        Unable to load tenants.
      </Alert>
    </Stack>
  );
}

