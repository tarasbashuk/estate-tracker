'use server';

import { revalidatePath } from 'next/cache';

import {
  archiveProperty,
  createProperty,
  updateProperty,
} from '@/features/properties/service';
import {
  propertySchema,
  type PropertyActionState,
  type PropertyFormValues,
} from '@/features/properties/schemas';
import { requireUser } from '@/server/requireUser';

export async function createPropertyAction(
  values: PropertyFormValues,
): Promise<PropertyActionState> {
  const parsed = propertySchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await createProperty(user.id, parsed.data);
    revalidatePath('/properties');

    return { ok: true };
  } catch (error) {
    console.error('Unable to create property:', error);

    return {
      ok: false,
      formError: 'Unable to create property. Please try again.',
    };
  }
}

export async function updatePropertyAction(
  propertyId: string,
  values: PropertyFormValues,
): Promise<PropertyActionState> {
  const parsed = propertySchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await updateProperty(user.id, propertyId, parsed.data);
    revalidatePath('/properties');
    revalidatePath(`/properties/${propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to update property:', error);

    return {
      ok: false,
      formError: 'Unable to update property. Please try again.',
    };
  }
}

export async function archivePropertyAction(propertyId: string) {
  try {
    const user = await requireUser();
    await archiveProperty(user.id, propertyId);
    revalidatePath('/properties');

    return { ok: true };
  } catch (error) {
    console.error('Unable to archive property:', error);

    return {
      ok: false,
      formError: 'Unable to archive property. Please try again.',
    };
  }
}

function getFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: PropertyActionState['fieldErrors'] = {};

  issues.forEach((issue) => {
    const field = issue.path[0] as keyof PropertyFormValues | undefined;

    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  });

  return fieldErrors;
}
