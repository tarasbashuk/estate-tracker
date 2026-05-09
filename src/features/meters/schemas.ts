import { z } from 'zod';

export const submissionMethodValues = [
  'WEBSITE',
  'EMAIL',
  'PHONE',
  'MESSENGER',
  'IN_PERSON',
  'OTHER',
] as const;

export const meterReadingStatusValues = [
  'WAITING_FOR_TENANT',
  'RECEIVED_FROM_TENANT',
  'SUBMITTED_TO_PROVIDER',
  'NOT_REQUIRED',
] as const;

export const meterSchema = z
  .object({
    utilityTypeId: z.string().min(1, 'Utility type is required'),
    name: z.string().trim().min(1, 'Name is required').max(120),
    providerName: z.string().trim().max(120).optional().or(z.literal('')),
    accountNumber: z.string().trim().max(120).optional().or(z.literal('')),
    submissionMethod: z.enum(submissionMethodValues),
    submissionUrl: z.string().trim().max(500).optional().or(z.literal('')),
    submissionEmail: z
      .string()
      .trim()
      .email('Enter a valid email')
      .optional()
      .or(z.literal('')),
    submissionDayStart: z
      .number('Start day must be a number')
      .int('Start day must be a whole number')
      .min(1, 'Start day must be from 1 to 31')
      .max(31, 'Start day must be from 1 to 31')
      .optional(),
    submissionDayEnd: z
      .number('End day must be a number')
      .int('End day must be a whole number')
      .min(1, 'End day must be from 1 to 31')
      .max(31, 'End day must be from 1 to 31')
      .optional(),
    notes: z.string().trim().max(1000).optional().or(z.literal('')),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    if (
      values.submissionDayStart &&
      values.submissionDayEnd &&
      values.submissionDayEnd < values.submissionDayStart
    ) {
      context.addIssue({
        code: 'custom',
        path: ['submissionDayEnd'],
        message: 'End day cannot be before start day',
      });
    }
  });

export const meterReadingSchema = z
  .object({
    meterId: z.string().min(1, 'Meter is required'),
    periodMonth: z
      .number('Month must be a number')
      .int('Month must be a whole number')
      .min(1, 'Month must be from 1 to 12')
      .max(12, 'Month must be from 1 to 12'),
    periodYear: z
      .number('Year must be a number')
      .int('Year must be a whole number')
      .min(2000, 'Year is too early')
      .max(2100, 'Year is too far in the future'),
    previousValue: z
      .number('Previous value must be a number')
      .nonnegative('Previous value cannot be negative')
      .optional(),
    currentValue: z
      .number('Current value must be a number')
      .nonnegative('Current value cannot be negative')
      .optional(),
    readingReceivedFromTenant: z.boolean(),
    submittedToProvider: z.boolean(),
    status: z.enum(meterReadingStatusValues),
    notes: z.string().trim().max(1000).optional().or(z.literal('')),
  })
  .superRefine((values, context) => {
    if (
      values.previousValue !== undefined &&
      values.currentValue !== undefined &&
      values.currentValue < values.previousValue
    ) {
      context.addIssue({
        code: 'custom',
        path: ['currentValue'],
        message: 'Current value cannot be lower than previous value',
      });
    }
  });

export type MeterFormValues = z.infer<typeof meterSchema>;
export type MeterReadingFormValues = z.infer<typeof meterReadingSchema>;

export type MeterActionState<TField extends string> = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<TField, string>>;
};

export type MeterFormActionState = MeterActionState<keyof MeterFormValues>;

export type MeterReadingActionState =
  MeterActionState<keyof MeterReadingFormValues>;
