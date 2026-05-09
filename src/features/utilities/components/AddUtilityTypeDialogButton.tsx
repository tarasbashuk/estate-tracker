'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import { UtilityTypeForm } from './UtilityTypeForm';

export function AddUtilityTypeDialogButton({
  propertyId,
}: {
  propertyId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Custom type
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add custom utility type"
        description="Create a reusable utility or recurring charge type."
        onClose={() => setIsOpen(false)}
      >
        <UtilityTypeForm
          propertyId={propertyId}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
