'use server';

import { revalidatePath } from 'next/cache';

import {
  cancelRentalAgreement,
  createRentalAgreement,
  updateRentalAgreement,
} from '@/features/agreements/service';
import {
  rentalAgreementSchema,
  type RentalAgreementActionState,
  type RentalAgreementFormValues,
} from '@/features/agreements/schemas';
import { requireUser } from '@/server/requireUser';

export async function createRentalAgreementAction(
  values: RentalAgreementFormValues,
): Promise<RentalAgreementActionState> {
  const parsed = rentalAgreementSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await createRentalAgreement(user.id, parsed.data);
    revalidatePath('/agreements');
    revalidatePath(`/properties/${parsed.data.propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to create rental agreement:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to create rental agreement.'),
    };
  }
}

export async function updateRentalAgreementAction(
  agreementId: string,
  values: RentalAgreementFormValues,
): Promise<RentalAgreementActionState> {
  const parsed = rentalAgreementSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await updateRentalAgreement(user.id, agreementId, parsed.data);
    revalidatePath('/agreements');
    revalidatePath(`/agreements/${agreementId}`);
    revalidatePath(`/properties/${parsed.data.propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to update rental agreement:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to update rental agreement.'),
    };
  }
}

export async function cancelRentalAgreementAction(agreementId: string) {
  try {
    const user = await requireUser();
    const agreement = await cancelRentalAgreement(user.id, agreementId);
    revalidatePath('/agreements');
    revalidatePath(`/agreements/${agreementId}`);
    revalidatePath(`/properties/${agreement.propertyId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to cancel rental agreement:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to cancel rental agreement.'),
    };
  }
}

function getFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: RentalAgreementActionState['fieldErrors'] = {};

  issues.forEach((issue) => {
    const field = issue.path[0] as
      | keyof RentalAgreementFormValues
      | undefined;

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

