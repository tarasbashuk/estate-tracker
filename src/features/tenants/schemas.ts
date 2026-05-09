import { z } from 'zod';

export const messengerTypeValues = [
  'TELEGRAM',
  'WHATSAPP',
  'VIBER',
  'EMAIL',
  'PHONE',
  'OTHER',
] as const;

export const tenantSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(160),
  phone: z.string().trim().max(60).optional().or(z.literal('')),
  email: z
    .string()
    .trim()
    .email('Enter a valid email')
    .optional()
    .or(z.literal('')),
  messengerType: z.enum(messengerTypeValues),
  messengerHandle: z.string().trim().max(120).optional().or(z.literal('')),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

export type TenantFormValues = z.infer<typeof tenantSchema>;

export type TenantActionState = {
  ok: boolean;
  formError?: string;
  fieldErrors?: Partial<Record<keyof TenantFormValues, string>>;
};

