import { Box, CircularProgress, Stack, Typography } from '@mui/material';

export default function PropertiesLoading() {
  return (
    <Box sx={{ py: 8 }}>
      <Stack alignItems="center" spacing={2}>
        <CircularProgress />
        <Typography color="text.secondary">Loading properties...</Typography>
      </Stack>
    </Box>
  );
}

