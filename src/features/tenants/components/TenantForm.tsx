'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { createTenantAction } from '@/app/actions/tenants';
import {
  messengerTypeValues,
  tenantSchema,
  type TenantActionState,
  type TenantFormValues,
} from '@/features/tenants/schemas';

const messengerTypeLabels: Record<
  (typeof messengerTypeValues)[number],
  string
> = {
  TELEGRAM: 'Telegram',
  WHATSAPP: 'WhatsApp',
  VIBER: 'Viber',
  EMAIL: 'Email',
  PHONE: 'Phone',
  OTHER: 'Other',
};

type TenantFormProps = {
  defaultValues?: Partial<TenantFormValues>;
  submitLabel?: string;
  title?: string;
  description?: string;
  onSubmitAction?: (values: TenantFormValues) => Promise<TenantActionState>;
};

const defaultTenantValues: TenantFormValues = {
  fullName: '',
  phone: '',
  email: '',
  messengerType: 'OTHER',
  messengerHandle: '',
  notes: '',
};

export function TenantForm(props: TenantFormProps = {}) {
  const {
    defaultValues,
    submitLabel = 'Create tenant',
    title = 'Add tenant',
    description = 'Add contact details for a tenant. Agreements come later.',
    onSubmitAction = createTenantAction,
  } = props;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      ...defaultTenantValues,
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await onSubmitAction(values);

      if (!result.ok) {
        applyActionErrors(result, setError);
        return;
      }

      reset({ ...defaultTenantValues, ...defaultValues });
      router.refresh();
    });
  });

  useEffect(() => {
    router.prefetch('/tenants');
  }, [router]);

  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      elevation={0}
      sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>

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
          <Box>
            <TextField
              label="Full name"
              fullWidth
              required
              disabled={isPending}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
              {...register('fullName')}
            />
          </Box>
          <Box>
            <TextField
              label="Email"
              type="email"
              fullWidth
              disabled={isPending}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email')}
            />
          </Box>
          <Box>
            <TextField
              label="Phone"
              fullWidth
              disabled={isPending}
              error={Boolean(errors.phone)}
              helperText={errors.phone?.message}
              {...register('phone')}
            />
          </Box>
          <Box>
            <Controller
              name="messengerType"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Messenger"
                  select
                  fullWidth
                  disabled={isPending}
                  error={Boolean(errors.messengerType)}
                  helperText={errors.messengerType?.message}
                  {...field}
                  value={field.value ?? 'OTHER'}
                >
                  {messengerTypeValues.map((value) => (
                    <MenuItem key={value} value={value}>
                      {messengerTypeLabels[value]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              label="Messenger handle"
              fullWidth
              disabled={isPending}
              error={Boolean(errors.messengerHandle)}
              helperText={errors.messengerHandle?.message}
              {...register('messengerHandle')}
            />
          </Box>
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
            {isPending ? 'Saving...' : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

function applyActionErrors(
  result: TenantActionState,
  setError: ReturnType<typeof useForm<TenantFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof TenantFormValues, { message });
      }
    });
  }
}
