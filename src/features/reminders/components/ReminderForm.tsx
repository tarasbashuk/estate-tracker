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

import { createReminderAction } from '@/app/actions/reminders';
import {
  reminderSchema,
  reminderTypeValues,
  type ReminderActionState,
  type ReminderFormValues,
} from '@/features/reminders/schemas';

type Option = {
  id: string;
  label: string;
};

type ReminderFormProps = {
  properties: Option[];
  tenants: Option[];
  statements: Option[];
  meters: Option[];
  onSuccess?: () => void;
};

const typeLabels: Record<(typeof reminderTypeValues)[number], string> = {
  REQUEST_METER_READINGS_FROM_TENANT: 'Request meter readings',
  SUBMIT_METER_READINGS_TO_PROVIDER: 'Submit readings to provider',
  RENT_PAYMENT_DUE: 'Rent payment due',
  UTILITIES_PAYMENT_DUE: 'Utilities payment due',
  CUSTOM: 'Custom',
};

const today = new Date().toISOString().slice(0, 10);

const defaultValues: ReminderFormValues = {
  type: 'CUSTOM',
  title: '',
  description: '',
  dueDate: today,
  propertyId: '',
  tenantId: '',
  monthlyStatementId: '',
  meterId: '',
};

export function ReminderForm({
  properties,
  tenants,
  statements,
  meters,
  onSuccess,
}: ReminderFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createReminderAction(values);

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

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              label="Type"
              select
              fullWidth
              disabled={isPending}
              error={Boolean(errors.type)}
              helperText={errors.type?.message}
              {...field}
            >
              {reminderTypeValues.map((type) => (
                <MenuItem key={type} value={type}>
                  {typeLabels[type]}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <TextField
          label="Title"
          fullWidth
          required
          disabled={isPending}
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
          {...register('title')}
        />

        <TextField
          label="Due date"
          type="date"
          fullWidth
          required
          disabled={isPending}
          slotProps={{ inputLabel: { shrink: true } }}
          error={Boolean(errors.dueDate)}
          helperText={errors.dueDate?.message}
          {...register('dueDate')}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          }}
        >
          <OptionalSelect
            name="propertyId"
            label="Property"
            control={control}
            disabled={isPending}
            options={properties}
          />
          <OptionalSelect
            name="tenantId"
            label="Tenant"
            control={control}
            disabled={isPending}
            options={tenants}
          />
          <OptionalSelect
            name="monthlyStatementId"
            label="Statement"
            control={control}
            disabled={isPending}
            options={statements}
          />
          <OptionalSelect
            name="meterId"
            label="Meter"
            control={control}
            disabled={isPending}
            options={meters}
          />
        </Box>

        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={3}
          disabled={isPending}
          error={Boolean(errors.description)}
          helperText={errors.description?.message}
          {...register('description')}
        />

        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Saving...' : 'Create reminder'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function OptionalSelect({
  name,
  label,
  control,
  disabled,
  options,
}: {
  name: keyof ReminderFormValues;
  label: string;
  control: ReturnType<typeof useForm<ReminderFormValues>>['control'];
  disabled: boolean;
  options: Option[];
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          label={label}
          select
          fullWidth
          disabled={disabled}
          {...field}
          value={field.value ?? ''}
        >
          <MenuItem value="">None</MenuItem>
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

function applyActionErrors(
  result: ReminderActionState,
  setError: ReturnType<typeof useForm<ReminderFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof ReminderFormValues, { message });
      }
    });
  }
}
