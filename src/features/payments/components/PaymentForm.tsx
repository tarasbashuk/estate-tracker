'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { createPaymentAction } from '@/app/actions/payments';
import {
  paymentCategoryValues,
  paymentMethodValues,
  paymentSchema,
  type PaymentActionState,
  type PaymentFormValues,
} from '@/features/payments/schemas';

type PaymentFormProps = {
  monthlyStatementId: string;
  onSuccess?: () => void;
};

const categoryLabels: Record<(typeof paymentCategoryValues)[number], string> = {
  RENT: 'Rent',
  UTILITIES: 'Utilities',
  DEPOSIT: 'Deposit',
  MIXED: 'Mixed',
  OTHER: 'Other',
};

const methodLabels: Record<(typeof paymentMethodValues)[number], string> = {
  BANK_TRANSFER: 'Bank transfer',
  CASH: 'Cash',
  CARD: 'Card',
  OTHER: 'Other',
};

const today = new Date().toISOString().slice(0, 10);

const defaultValues: PaymentFormValues = {
  amount: undefined as unknown as number,
  currency: 'UAH',
  category: 'MIXED',
  method: 'BANK_TRANSFER',
  paidAt: today,
  notes: '',
};

export function PaymentForm({
  monthlyStatementId,
  onSuccess,
}: PaymentFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createPaymentAction(monthlyStatementId, values);

      if (!result.ok) {
        applyActionErrors(result, setError);
        return;
      }

      reset(defaultValues);
      onSuccess?.();
      router.refresh();
    });
  });

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={3}>
        {errors.root?.message && (
          <Alert severity="error">{errors.root.message}</Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          }}
        >
          <TextField
            label="Amount"
            type="number"
            fullWidth
            required
            disabled={isPending}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
            error={Boolean(errors.amount)}
            helperText={errors.amount?.message}
            {...register('amount', {
              setValueAs: (value) =>
                value === '' || value === null ? undefined : Number(value),
            })}
          />
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <TextField
                label="Currency"
                select
                fullWidth
                disabled={isPending}
                error={Boolean(errors.currency)}
                helperText={errors.currency?.message}
                {...field}
              >
                {['UAH', 'USD', 'EUR'].map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                label="Category"
                select
                fullWidth
                disabled={isPending}
                error={Boolean(errors.category)}
                helperText={errors.category?.message}
                {...field}
              >
                {paymentCategoryValues.map((category) => (
                  <MenuItem key={category} value={category}>
                    {categoryLabels[category]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="method"
            control={control}
            render={({ field }) => (
              <TextField
                label="Method"
                select
                fullWidth
                disabled={isPending}
                error={Boolean(errors.method)}
                helperText={errors.method?.message}
                {...field}
              >
                {paymentMethodValues.map((method) => (
                  <MenuItem key={method} value={method}>
                    {methodLabels[method]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="Paid date"
            type="date"
            fullWidth
            required
            disabled={isPending}
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.paidAt)}
            helperText={errors.paidAt?.message}
            {...register('paidAt')}
          />
          <Box />
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              label="Notes"
              fullWidth
              multiline
              minRows={3}
              disabled={isPending}
              error={Boolean(errors.notes)}
              helperText={errors.notes?.message}
              {...register('notes')}
            />
          </Box>
        </Box>

        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save payment'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function applyActionErrors(
  result: PaymentActionState,
  setError: ReturnType<typeof useForm<PaymentFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof PaymentFormValues, { message });
      }
    });
  }
}
