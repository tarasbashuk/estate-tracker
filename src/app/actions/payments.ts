'use server';

import { revalidatePath } from 'next/cache';

import { createPayment } from '@/features/payments/service';
import {
  paymentSchema,
  type PaymentActionState,
  type PaymentFormValues,
} from '@/features/payments/schemas';
import { requireUser } from '@/server/requireUser';

export async function createPaymentAction(
  monthlyStatementId: string,
  values: PaymentFormValues,
): Promise<PaymentActionState> {
  const parsed = paymentSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await createPayment(user.id, monthlyStatementId, parsed.data);
    revalidatePath('/statements');
    revalidatePath(`/statements/${monthlyStatementId}`);

    return { ok: true };
  } catch (error) {
    console.error('Unable to create payment:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to create payment.'),
    };
  }
}

function getFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: PaymentActionState['fieldErrors'] = {};

  issues.forEach((issue) => {
    const field = issue.path[0] as keyof PaymentFormValues | undefined;

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
