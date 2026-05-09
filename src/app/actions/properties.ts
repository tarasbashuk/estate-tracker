'use server';

import { revalidatePath } from 'next/cache';

import { createProperty } from '@/features/properties/service';
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
    const fieldErrors: PropertyActionState['fieldErrors'] = {};

    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof PropertyFormValues | undefined;

      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    return {
      ok: false,
      fieldErrors,
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
