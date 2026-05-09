'use client';

import { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export function CopyStatementMessageButton({ message }: { message: string }) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<ContentCopyIcon />}
        onClick={async () => {
          await navigator.clipboard.writeText(message);
          setIsCopied(true);
        }}
      >
        Copy message
      </Button>
      <Snackbar
        open={isCopied}
        autoHideDuration={2500}
        message="Message copied"
        onClose={() => setIsCopied(false)}
      />
    </>
  );
}
