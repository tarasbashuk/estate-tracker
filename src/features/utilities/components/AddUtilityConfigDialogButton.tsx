'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import {
  type UtilityTypeOption,
  UtilityConfigForm,
} from './UtilityConfigForm';

type AddUtilityConfigDialogButtonProps = {
  propertyId: string;
  utilityTypes: UtilityTypeOption[];
};

export function AddUtilityConfigDialogButton({
  propertyId,
  utilityTypes,
}: AddUtilityConfigDialogButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Add utility
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add utility"
        description="Enable a utility or recurring charge for this property."
        onClose={() => setIsOpen(false)}
      >
        <UtilityConfigForm
          propertyId={propertyId}
          utilityTypes={utilityTypes}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
