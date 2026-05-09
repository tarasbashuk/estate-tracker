'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import {
  CreateStatementForm,
  type StatementPropertyOption,
} from './CreateStatementForm';

export function AddStatementDialogButton({
  properties,
}: {
  properties: StatementPropertyOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Add statement
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add monthly statement"
        description="Create a statement from the active agreement and enabled property utilities."
        onClose={() => setIsOpen(false)}
      >
        <CreateStatementForm
          properties={properties}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
