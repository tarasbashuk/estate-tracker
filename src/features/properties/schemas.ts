import { z } from 'zod';

export const propertyTypeValues = [
  'APARTMENT',
  'HOUSE',
  'COMMERCIAL',
  'OTHER',
] as const;

export const propertySchema = z.object({
  name: z.string().trim().min(1, 'Property name is required').max(120),
  addressLine1: z.string().trim().min(1, 'Address is required').max(180),
  addressLine2: z.string().trim().max(180).optional().or(z.literal('')),
  city: z.string().trim().min(1, 'City is required').max(100),
  country: z.string().trim().min(1, 'Country is required').max(100),
  postalCode: z.string().trim().max(30).optional().or(z.literal('')),
  area: z
    .number({ invalid_type_error: 'Area must be a number' })
    .positive('Area must be greater than zero')
    .optional(),
  rooms: z
    .number({ invalid_type_error: 'Rooms must be a number' })
    .int('Rooms must be a whole number')
    .positive('Rooms must be greater than zero')
    .optional(),
  propertyType: z.enum(propertyTypeValues),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export type PropertyActionState = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<keyof PropertyFormValues, string>>;
};

