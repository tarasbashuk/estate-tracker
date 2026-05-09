'use server';

import { revalidatePath } from 'next/cache';

import {
  createMonthlyStatement,
} from '@/features/statements/service';
import {
  createStatementSchema,
  type CreateStatementFormValues,
  type StatementActionState,
} from '@/features/statements/schemas';
import { requireUser } from '@/server/requireUser';

export async function createMonthlyStatementAction(
  values: CreateStatementFormValues,
): Promise<StatementActionState> {
  const parsed = createStatementSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    const statement = await createMonthlyStatement(user.id, parsed.data);
    revalidatePath('/statements');
    revalidatePath(`/properties/${parsed.data.propertyId}`);

    return { ok: true, statementId: statement.id };
  } catch (error) {
    console.error('Unable to create monthly statement:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to create monthly statement.'),
    };
  }
}

function getFieldErrors(
  issues: { path: PropertyKey[]; message: string }[],
) {
  const fieldErrors: StatementActionState['fieldErrors'] = {};

  issues.forEach((issue) => {
    const field = issue.path[0] as
      | keyof CreateStatementFormValues
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
