import { z } from 'zod';

export const reminderTypeValues = [
  'REQUEST_METER_READINGS_FROM_TENANT',
  'SUBMIT_METER_READINGS_TO_PROVIDER',
  'RENT_PAYMENT_DUE',
  'UTILITIES_PAYMENT_DUE',
  'CUSTOM',
] as const;

export const reminderStatusValues = [
  'OPEN',
  'DONE',
  'SKIPPED',
  'CANCELLED',
] as const;

export const reminderSchema = z.object({
  type: z.enum(reminderTypeValues),
  title: z.string().trim().min(1, 'Title is required').max(160),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  dueDate: z.string().min(1, 'Due date is required'),
  propertyId: z.string().optional().or(z.literal('')),
  tenantId: z.string().optional().or(z.literal('')),
  monthlyStatementId: z.string().optional().or(z.literal('')),
  meterId: z.string().optional().or(z.literal('')),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;

export type ReminderActionState = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<keyof ReminderFormValues, string>>;
};
