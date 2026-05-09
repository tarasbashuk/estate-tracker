'use client';

import { Box, Typography } from '@mui/material';

import { useT } from '@/components/layout/LocaleProvider';

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const t = useT();

  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {t(title)}
      </Typography>
      <Typography color="text.secondary">{t(description)}</Typography>
    </Box>
  );
}
