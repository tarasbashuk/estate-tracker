import { CircularProgress, Stack, Typography } from '@mui/material';

export default function StatementDetailsLoading() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', py: 8 }}>
      <CircularProgress />
      <Typography color="text.secondary">Loading statement...</Typography>
    </Stack>
  );
}
