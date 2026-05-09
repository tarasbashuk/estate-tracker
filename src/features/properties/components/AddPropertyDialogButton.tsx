'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import { CreatePropertyForm } from './CreatePropertyForm';

export function AddPropertyDialogButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Add property
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add property"
        description="Add the basic property details. Tenant and agreement setup comes later."
        onClose={() => setIsOpen(false)}
      >
        <CreatePropertyForm
          paper={false}
          showHeader={false}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}

