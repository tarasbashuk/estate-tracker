import { Box, CircularProgress, Stack, Typography } from '@mui/material';

export default function TenantDetailsLoading() {
  return (
    <Box sx={{ py: 8 }}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress />
        <Typography color="text.secondary">Loading tenant...</Typography>
      </Stack>
    </Box>
  );
}

