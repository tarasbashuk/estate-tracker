import Link from 'next/link';
import { Button, Paper, Stack, Typography } from '@mui/material';

import { CopyStatementMessageButton } from './CopyStatementMessageButton';

export function TenantStatementPanel({
  statementId,
  message,
}: {
  statementId: string;
  message: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" component="h2">
              Tenant summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Message and printable statement for the tenant.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <CopyStatementMessageButton message={message} />
            <Link href={`/print/statements/${statementId}`} target="_blank">
              <Button variant="outlined">Printable summary</Button>
            </Link>
          </Stack>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: 'background.default',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: 14,
            overflowX: 'auto',
          }}
        >
          {message}
        </Paper>
      </Stack>
    </Paper>
  );
}
