'use client';

import { useRouter } from 'next/navigation';

import { updateTenantAction } from '@/app/actions/tenants';
import type { TenantFormValues } from '@/features/tenants/schemas';
import { TenantForm } from './TenantForm';

type EditTenantFormProps = {
  tenantId: string;
  defaultValues: TenantFormValues;
};

export function EditTenantForm({
  tenantId,
  defaultValues,
}: EditTenantFormProps) {
  const router = useRouter();

  return (
    <TenantForm
      defaultValues={defaultValues}
      title="Edit tenant"
      description="Update contact details for this tenant."
      submitLabel="Save changes"
      onSubmitAction={async (values) => {
        const result = await updateTenantAction(tenantId, values);

        if (result.ok) {
          router.refresh();
        }

        return result;
      }}
    />
  );
}

