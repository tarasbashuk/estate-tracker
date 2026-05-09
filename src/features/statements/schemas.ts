import { z } from 'zod';

export const statementStatusValues = [
  'DRAFT',
  'READY_TO_SEND',
  'SENT',
  'CANCELLED',
] as const;

export const createStatementSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
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
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.enum(statementStatusValues),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export type CreateStatementFormValues = z.infer<typeof createStatementSchema>;

export type StatementActionState = {
  ok: boolean;
  statementId?: string;
  formError?: string;
  fieldErrors?: Partial<Record<keyof CreateStatementFormValues, string>>;
};
