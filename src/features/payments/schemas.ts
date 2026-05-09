import { z } from 'zod';

export const paymentCategoryValues = [
  'RENT',
  'UTILITIES',
  'DEPOSIT',
  'MIXED',
  'OTHER',
] as const;

export const paymentMethodValues = [
  'BANK_TRANSFER',
  'CASH',
  'CARD',
  'OTHER',
] as const;

export const paymentSchema = z.object({
  amount: z
    .number('Amount must be a number')
    .positive('Amount must be greater than zero'),
  currency: z.enum(['UAH', 'USD', 'EUR']),
  category: z.enum(paymentCategoryValues),
  method: z.enum(paymentMethodValues),
  paidAt: z.string().min(1, 'Payment date is required'),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export type PaymentActionState = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<keyof PaymentFormValues, string>>;
};
