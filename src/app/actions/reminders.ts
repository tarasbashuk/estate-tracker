'use server';

import { revalidatePath } from 'next/cache';
import { ReminderStatus } from '@/generated/prisma/client';

import {
  createReminder,
  generateAutomaticReminders,
  updateReminderStatus,
} from '@/features/reminders/service';
import {
  reminderSchema,
  type ReminderActionState,
  type ReminderFormValues,
} from '@/features/reminders/schemas';
import { requireUser } from '@/server/requireUser';

export async function createReminderAction(
  values: ReminderFormValues,
): Promise<ReminderActionState> {
  const parsed = reminderSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: getFieldErrors(parsed.error.issues),
    };
  }

  try {
    const user = await requireUser();
    await createReminder(user.id, parsed.data);
    revalidateReminderPaths();

    return { ok: true };
  } catch (error) {
    console.error('Unable to create reminder:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to create reminder.'),
    };
  }
}

export async function markReminderDoneAction(reminderId: string) {
  return updateStatus(reminderId, ReminderStatus.DONE);
}

export async function skipReminderAction(reminderId: string) {
  return updateStatus(reminderId, ReminderStatus.SKIPPED);
}

export async function cancelReminderAction(reminderId: string) {
  return updateStatus(reminderId, ReminderStatus.CANCELLED);
}

export async function generateAutomaticRemindersAction() {
  try {
    const user = await requireUser();
    const createdCount = await generateAutomaticReminders(user.id);
    revalidateReminderPaths();

    return { ok: true, createdCount };
  } catch (error) {
    console.error('Unable to generate reminders:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to generate reminders.'),
    };
  }
}

async function updateStatus(reminderId: string, status: ReminderStatus) {
  try {
    const user = await requireUser();
    await updateReminderStatus(user.id, reminderId, status);
    revalidateReminderPaths();

    return { ok: true };
  } catch (error) {
    console.error('Unable to update reminder:', error);

    return {
      ok: false,
      formError: getFormError(error, 'Unable to update reminder.'),
    };
  }
}

function revalidateReminderPaths() {
  revalidatePath('/dashboard');
  revalidatePath('/reminders');
}

function getFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: ReminderActionState['fieldErrors'] = {};

  issues.forEach((issue) => {
    const field = issue.path[0] as keyof ReminderFormValues | undefined;

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
