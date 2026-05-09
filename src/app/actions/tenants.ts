'use server';

import { revalidatePath } from 'next/cache';

import {
  archiveTenant,
  createTenant,
  updateTenant,
} from '@/features/tenants/service';
import {
  tenantSchema,
  type TenantActionState,
  type TenantFormValues,
} from '@/features/tenants/schemas';
import { requireUser } from '@/server/requireUser';

export async function createTenantAction(
  values: TenantFormValues,
): Promise<TenantActionState> {
  const parsed = tenantSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await createTenant(user.id, parsed.data);
    revalidatePath('/tenants');

    return { ok: true };
  } catch (error) {
    console.error('Unable to create tenant:', error);

    return {
      ok: false,
      formError: 'Unable to create tenant. Please try again.',
    };
  }
}

export async function updateTenantAction(
  tenantId: string,
  values: TenantFormValues,
): Promise<TenantActionState> {
  const parsed = tenantSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await updateTenant(user.id, tenantId, parsed.data);
    revalidatePath('/tenants');
    revalidatePath(`/tenants/${tenantId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to update tenant:', error);

    return {
      ok: false,
      formError: 'Unable to update tenant. Please try again.',
    };
  }
}

export async function archiveTenantAction(tenantId: string) {
  try {
    const user = await requireUser();
    await archiveTenant(user.id, tenantId);
    revalidatePath('/tenants');

    return { ok: true };
  } catch (error) {
    console.error('Unable to archive tenant:', error);

    return {
      ok: false,
      formError: 'Unable to archive tenant. Please try again.',
    };
  }
}

function getFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: TenantActionState['fieldErrors'] = {};

  issues.forEach((issue) => {
    const field = issue.path[0] as keyof TenantFormValues | undefined;

    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  });

  return fieldErrors;
}

