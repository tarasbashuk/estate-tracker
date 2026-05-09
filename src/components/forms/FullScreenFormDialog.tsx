'use client';

import {
  AppBar,
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useT } from '@/components/layout/LocaleProvider';

type FullScreenFormDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  closeLabel?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function FullScreenFormDialog({
  open,
  title,
  description,
  closeLabel = 'Close',
  children,
  onClose,
}: FullScreenFormDialogProps) {
  const t = useT();

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <AppBar color="default" elevation={0} sx={{ position: 'sticky' }}>
        <Toolbar>
          <IconButton edge="start" aria-label={t(closeLabel)} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2" sx={{ ml: 2, flex: 1 }}>
            {t(title)}
          </Typography>
          <Button onClick={onClose}>{t(closeLabel)}</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
        <Stack spacing={3} sx={{ maxWidth: 760, mx: 'auto' }}>
          {description ? (
            <Typography color="text.secondary">{t(description)}</Typography>
          ) : null}
          {children}
        </Stack>
      </Box>
    </Dialog>
  );
}
