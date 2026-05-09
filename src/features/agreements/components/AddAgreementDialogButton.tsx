'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { FullScreenFormDialog } from '@/components/forms/FullScreenFormDialog';
import {
  type AgreementPropertyOption,
  type AgreementTenantOption,
  RentalAgreementForm,
} from './RentalAgreementForm';
import type { RentalAgreementFormValues } from '../schemas';

type AddAgreementDialogButtonProps = {
  properties: AgreementPropertyOption[];
  tenants: AgreementTenantOption[];
  defaultValues?: Partial<RentalAgreementFormValues>;
};

export function AddAgreementDialogButton({
  properties,
  tenants,
  defaultValues,
}: AddAgreementDialogButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
      >
        Add agreement
      </Button>
      <FullScreenFormDialog
        open={isOpen}
        title="Add rental agreement"
        description="Connect a property and tenant with rent and payment terms."
        onClose={() => setIsOpen(false)}
      >
        <RentalAgreementForm
          properties={properties}
          tenants={tenants}
          defaultValues={defaultValues}
          paper={false}
          showHeader={false}
          onSuccess={() => setIsOpen(false)}
        />
      </FullScreenFormDialog>
    </>
  );
}
