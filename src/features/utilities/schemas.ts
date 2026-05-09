import { z } from 'zod';

export const utilityConfigSchema = z.object({
  utilityTypeId: z.string().min(1, 'Utility type is required'),
  isEnabled: z.boolean(),
  defaultAmount: z
    .number('Default amount must be a number')
    .nonnegative('Default amount cannot be negative')
    .optional(),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export const utilityTypeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  description: z.string().trim().max(500).optional().or(z.literal('')),
});

export type UtilityConfigFormValues = z.infer<typeof utilityConfigSchema>;
export type UtilityTypeFormValues = z.infer<typeof utilityTypeSchema>;

export type UtilityActionState<TField extends string> = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<TField, string>>;
};

export type UtilityConfigActionState =
  UtilityActionState<keyof UtilityConfigFormValues>;

export type UtilityTypeActionState =
  UtilityActionState<keyof UtilityTypeFormValues>;
