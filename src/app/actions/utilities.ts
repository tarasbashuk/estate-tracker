'use server';

import { revalidatePath } from 'next/cache';

import {
  createPropertyUtilityConfig,
  createUtilityType,
  setPropertyUtilityConfigEnabled,
  updatePropertyUtilityConfig,
} from '@/features/utilities/service';
import {
  utilityConfigSchema,
  utilityTypeSchema,
  type UtilityConfigActionState,
  type UtilityConfigFormValues,
  type UtilityTypeActionState,
  type UtilityTypeFormValues,
} from '@/features/utilities/schemas';
import { requireUser } from '@/server/requireUser';

export async function createPropertyUtilityConfigAction(
  propertyId: string,
  values: UtilityConfigFormValues,
): Promise<UtilityConfigActionState> {
  const parsed = utilityConfigSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await createPropertyUtilityConfig(user.id, propertyId, parsed.data);
    revalidatePath(`/properties/${propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to create utility configuration:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to create utility configuration.'),
    };
  }
}

export async function updatePropertyUtilityConfigAction(
  propertyId: string,
  configId: string,
  values: UtilityConfigFormValues,
): Promise<UtilityConfigActionState> {
  const parsed = utilityConfigSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await updatePropertyUtilityConfig(user.id, configId, parsed.data);
    revalidatePath(`/properties/${propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to update utility configuration:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to update utility configuration.'),
    };
  }
}

export async function setPropertyUtilityConfigEnabledAction(
  propertyId: string,
  configId: string,
  isEnabled: boolean,
) {
  try {
    const user = await requireUser();
    await setPropertyUtilityConfigEnabled(user.id, configId, isEnabled);
    revalidatePath(`/properties/${propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to update utility status:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to update utility status.'),
    };
  }
}

export async function createUtilityTypeAction(
  propertyId: string,
  values: UtilityTypeFormValues,
): Promise<UtilityTypeActionState> {
  const parsed = utilityTypeSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await createUtilityType(user.id, parsed.data);
    revalidatePath(`/properties/${propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to create utility type:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to create utility type.'),
    };
  }
}

function getFieldErrors<TField extends string>(
  issues: { path: PropertyKey[]; message: string }[],
) {
  const fieldErrors: Partial<Record<TField, string>> = {};

  issues.forEach((issue) => {
    const field = issue.path[0] as TField | undefined;

    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  });

  return fieldErrors;
}

function getFormError(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return `${fallback} Please try again.`;
}
