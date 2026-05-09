'use client';

import { useState } from 'react';
import { Button } from '@mui/material';

import { updatePropertyUtilityConfigAction } from '@/app/actions/utilities';
import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import type { UtilityConfigFormValues } from '@/features/utilities/schemas';
import {
  type UtilityTypeOption,
  UtilityConfigForm,
} from './UtilityConfigForm';

type EditUtilityConfigDialogButtonProps = {
  propertyId: string;
  configId: string;
  utilityTypes: UtilityTypeOption[];
  defaultValues: UtilityConfigFormValues;
};

export function EditUtilityConfigDialogButton({
  propertyId,
  configId,
  utilityTypes,
  defaultValues,
}: EditUtilityConfigDialogButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="small" onClick={() => setIsOpen(true)}>
        Edit
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Edit utility"
        description="Update the default amount, notes, or enabled state."
        onClose={() => setIsOpen(false)}
      >
        <UtilityConfigForm
          propertyId={propertyId}
          utilityTypes={utilityTypes}
          defaultValues={defaultValues}
          submitLabel="Save changes"
          onSubmitAction={(values) =>
            updatePropertyUtilityConfigAction(propertyId, configId, values)
          }
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
