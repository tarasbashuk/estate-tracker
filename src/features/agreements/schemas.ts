import { z } from 'zod';

export const agreementStatusValues = [
  'DRAFT',
  'ACTIVE',
  'ENDED',
  'CANCELLED',
] as const;

export const currencyValues = ['UAH', 'USD', 'EUR'] as const;

export const rentalAgreementSchema = z
  .object({
    propertyId: z.string().min(1, 'Property is required'),
    tenantId: z.string().min(1, 'Tenant is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional().or(z.literal('')),
    status: z.enum(agreementStatusValues),
    monthlyRentAmount: z
      .number('Monthly rent must be a number')
      .positive('Monthly rent must be greater than zero'),
    monthlyRentCurrency: z.enum(currencyValues),
    paymentDueDay: z
      .number('Payment due day must be a number')
      .int('Payment due day must be a whole number')
      .min(1, 'Payment due day must be from 1 to 31')
      .max(31, 'Payment due day must be from 1 to 31'),
    depositAmount: z
      .number('Deposit must be a number')
      .nonnegative('Deposit cannot be negative')
      .optional(),
    depositCurrency: z.enum(currencyValues),
    notes: z.string().trim().max(1000).optional().or(z.literal('')),
  })
  .superRefine((values, context) => {
    if (!values.endDate) return;

    const startDate = new Date(values.startDate);
    const endDate = new Date(values.endDate);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return;
    }

    if (endDate < startDate) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be before start date',
      });
    }
  });

export type RentalAgreementFormValues = z.infer<
  typeof rentalAgreementSchema
>;

export type RentalAgreementActionState = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<keyof RentalAgreementFormValues, string>>;
};

