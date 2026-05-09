'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import { TenantForm } from './TenantForm';

export function AddTenantDialogButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Add tenant
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add tenant"
        description="Add contact details for a tenant. Agreements come later."
        onClose={() => setIsOpen(false)}
      >
        <TenantForm
          paper={false}
          showHeader={false}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}

