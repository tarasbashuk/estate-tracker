'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import { ReminderForm } from './ReminderForm';

type Option = {
  id: string;
  label: string;
};

export function AddReminderDialogButton({
  properties,
  tenants,
  statements,
  meters,
}: {
  properties: Option[];
  tenants: Option[];
  statements: Option[];
  meters: Option[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Add reminder
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add reminder"
        description="Create an internal task. Estate Tracker will not send messages automatically."
        onClose={() => setIsOpen(false)}
      >
        <ReminderForm
          properties={properties}
          tenants={tenants}
          statements={statements}
          meters={meters}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
