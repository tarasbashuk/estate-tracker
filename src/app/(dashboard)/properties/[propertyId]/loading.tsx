import { Box, CircularProgress, Stack, Typography } from '@mui/material';

export default function PropertyDetailsLoading() {
  return (
    <Box sx={{ py: 8 }}>
      <Stack spacing={2} sx={{ alignItems: 'center' }}>
        <CircularProgress />
        <Typography color="text.secondary">Loading property...</Typography>
      </Stack>
    </Box>
  );
}

