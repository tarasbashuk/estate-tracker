'use client';

import { useRouter } from 'next/navigation';

import { updateRentalAgreementAction } from '@/app/actions/agreements';
import type { RentalAgreementFormValues } from '@/features/agreements/schemas';
import {
  type AgreementPropertyOption,
  type AgreementTenantOption,
  RentalAgreementForm,
} from './RentalAgreementForm';

type EditAgreementFormProps = {
  agreementId: string;
  properties: AgreementPropertyOption[];
  tenants: AgreementTenantOption[];
  defaultValues: RentalAgreementFormValues;
};

export function EditAgreementForm({
  agreementId,
  properties,
  tenants,
  defaultValues,
}: EditAgreementFormProps) {
  const router = useRouter();

  return (
    <RentalAgreementForm
      properties={properties}
      tenants={tenants}
      defaultValues={defaultValues}
      title="Edit rental agreement"
      description="Update rent, dates, tenant, property, or agreement status."
      submitLabel="Save changes"
      onSubmitAction={async (values) => {
        const result = await updateRentalAgreementAction(agreementId, values);

        if (result.ok) {
          router.refresh();
        }

        return result;
      }}
    />
  );
}
