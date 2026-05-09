'use client';

import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

export function PrintButton() {
  return (
    <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>
      Print / Save PDF
    </Button>
  );
}
