'use client';

import { useState } from 'react';
import { Button } from '@mui/material';

import { updateMeterAction } from '@/app/actions/meters';
import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import type { MeterFormValues } from '@/features/meters/schemas';
import { type MeterUtilityTypeOption, MeterForm } from './MeterForm';

type EditMeterDialogButtonProps = {
  propertyId: string;
  meterId: string;
  utilityTypes: MeterUtilityTypeOption[];
  defaultValues: MeterFormValues;
};

export function EditMeterDialogButton({
  propertyId,
  meterId,
  utilityTypes,
  defaultValues,
}: EditMeterDialogButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Edit meter"
        description="Update meter details and provider submission settings."
        onClose={() => setIsOpen(false)}
      >
        <MeterForm
          propertyId={propertyId}
          utilityTypes={utilityTypes}
          defaultValues={defaultValues}
          submitLabel="Save changes"
          onSubmitAction={(values) =>
            updateMeterAction(propertyId, meterId, values)
          }
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
