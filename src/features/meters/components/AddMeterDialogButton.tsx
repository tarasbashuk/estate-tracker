'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import { type MeterUtilityTypeOption, MeterForm } from './MeterForm';

type AddMeterDialogButtonProps = {
  propertyId: string;
  utilityTypes: MeterUtilityTypeOption[];
};

export function AddMeterDialogButton({
  propertyId,
  utilityTypes,
}: AddMeterDialogButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Add meter
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add meter"
        description="Store provider and submission details for a property meter."
        onClose={() => setIsOpen(false)}
      >
        <MeterForm
          propertyId={propertyId}
          utilityTypes={utilityTypes}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
