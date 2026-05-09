'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import { PaymentForm } from './PaymentForm';

export function AddPaymentDialogButton({
  monthlyStatementId,
}: {
  monthlyStatementId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Add payment
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add payment"
        description="Record a tenant payment. Partial payment status is derived from totals."
        onClose={() => setIsOpen(false)}
      >
        <PaymentForm
          monthlyStatementId={monthlyStatementId}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
