'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import { type MeterOption, MeterReadingForm } from './MeterReadingForm';

type AddMeterReadingDialogButtonProps = {
  propertyId: string;
  meters: MeterOption[];
};

export function AddMeterReadingDialogButton({
  propertyId,
  meters,
}: AddMeterReadingDialogButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Add reading
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add meter reading"
        description="Record a monthly reading and track tenant/provider status."
        onClose={() => setIsOpen(false)}
      >
        <MeterReadingForm
          propertyId={propertyId}
          meters={meters}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
