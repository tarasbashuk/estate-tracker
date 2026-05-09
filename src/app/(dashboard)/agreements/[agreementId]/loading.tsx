import { Box, CircularProgress, Stack, Typography } from '@mui/material';

export default function AgreementDetailsLoading() {
  return (
    <Box sx={{ py: 8 }}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress />
        <Typography color="text.secondary">Loading agreement...</Typography>
      </Stack>
    </Box>
  );
}

