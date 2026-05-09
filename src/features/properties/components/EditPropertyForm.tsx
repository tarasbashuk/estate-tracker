'use client';

import { useRouter } from 'next/navigation';

import { updatePropertyAction } from '@/app/actions/properties';
import type { PropertyFormValues } from '@/features/properties/schemas';
import { CreatePropertyForm } from './CreatePropertyForm';

type EditPropertyFormProps = {
  propertyId: string;
  defaultValues: PropertyFormValues;
};

export function EditPropertyForm({
  propertyId,
  defaultValues,
}: EditPropertyFormProps) {
  const router = useRouter();

  return (
    <CreatePropertyForm
      defaultValues={defaultValues}
      title="Edit property"
      description="Update the basic property details."
      submitLabel="Save changes"
      onSubmitAction={async (values) => {
        const result = await updatePropertyAction(propertyId, values);

        if (result.ok) {
          router.refresh();
        }

        return result;
      }}
    />
  );
}

