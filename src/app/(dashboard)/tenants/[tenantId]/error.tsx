'use client';

import { Alert, Button, Stack, Typography } from '@mui/material';

export default function TenantDetailsError({ reset }: { reset: () => void }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" component="h1">
        Tenant
      </Typography>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={reset}>
            Retry
          </Button>
        }
      >
        Unable to load this tenant.
      </Alert>
    </Stack>
  );
}

