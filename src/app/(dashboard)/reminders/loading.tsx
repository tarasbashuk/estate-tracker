import { CircularProgress, Stack, Typography } from '@mui/material';

export default function RemindersLoading() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', py: 8 }}>
      <CircularProgress />
      <Typography color="text.secondary">Loading reminders...</Typography>
    </Stack>
  );
}
