'use server';

import { revalidatePath } from 'next/cache';

import {
  createMeter,
  createMeterReading,
  updateMeter,
} from '@/features/meters/service';
import {
  meterReadingSchema,
  meterSchema,
  type MeterFormActionState,
  type MeterFormValues,
  type MeterReadingActionState,
  type MeterReadingFormValues,
} from '@/features/meters/schemas';
import { requireUser } from '@/server/requireUser';

export async function createMeterAction(
  propertyId: string,
  values: MeterFormValues,
): Promise<MeterFormActionState> {
  const parsed = meterSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await createMeter(user.id, propertyId, parsed.data);
    revalidatePath(`/properties/${propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to create meter:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to create meter.'),
    };
  }
}

export async function updateMeterAction(
  propertyId: string,
  meterId: string,
  values: MeterFormValues,
): Promise<MeterFormActionState> {
  const parsed = meterSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await updateMeter(user.id, meterId, parsed.data);
    revalidatePath(`/properties/${propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to update meter:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to update meter.'),
    };
  }
}

export async function createMeterReadingAction(
  propertyId: string,
  values: MeterReadingFormValues,
): Promise<MeterReadingActionState> {
  const parsed = meterReadingSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await createMeterReading(user.id, propertyId, parsed.data);
    revalidatePath(`/properties/${propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to create meter reading:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to create meter reading.'),
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
