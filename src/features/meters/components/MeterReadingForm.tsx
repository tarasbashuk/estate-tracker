'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

import { createMeterReadingAction } from '@/app/actions/meters';
import {
  meterReadingSchema,
  meterReadingStatusValues,
  type MeterReadingActionState,
  type MeterReadingFormValues,
} from '@/features/meters/schemas';

export type MeterOption = {
  id: string;
  name: string;
};

type MeterReadingFormProps = {
  propertyId: string;
  meters: MeterOption[];
  defaultValues?: Partial<MeterReadingFormValues>;
  onSuccess?: () => void;
};

const statusLabels: Record<(typeof meterReadingStatusValues)[number], string> = {
  WAITING_FOR_TENANT: 'Waiting for tenant',
  RECEIVED_FROM_TENANT: 'Received from tenant',
  SUBMITTED_TO_PROVIDER: 'Submitted to provider',
  NOT_REQUIRED: 'Not required',
};

const currentDate = new Date();

const defaultReadingValues: MeterReadingFormValues = {
  meterId: '',
  periodMonth: currentDate.getMonth() + 1,
  periodYear: currentDate.getFullYear(),
  previousValue: undefined,
  currentValue: undefined,
  readingReceivedFromTenant: false,
  submittedToProvider: false,
  status: 'WAITING_FOR_TENANT',
  notes: '',
};

export function MeterReadingForm({
  propertyId,
  meters,
  defaultValues,
  onSuccess,
}: MeterReadingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<MeterReadingFormValues>({
    resolver: zodResolver(meterReadingSchema),
    defaultValues: {
      ...defaultReadingValues,
      meterId: meters[0]?.id ?? '',
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createMeterReadingAction(propertyId, values);

      if (!result.ok) {
        applyActionErrors(result, setError);
        return;
      }

      reset({
        ...defaultReadingValues,
        meterId: meters[0]?.id ?? '',
        ...defaultValues,
      });
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

        {meters.length === 0 ? (
          <Alert severity="warning">Create a meter before adding readings.</Alert>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          }}
        >
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Controller
              name="meterId"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Meter"
                  select
                  fullWidth
                  required
                  disabled={isPending || meters.length === 0}
                  error={Boolean(errors.meterId)}
                  helperText={errors.meterId?.message}
                  {...field}
                  value={field.value ?? ''}
                >
                  {meters.map((meter) => (
                    <MenuItem key={meter.id} value={meter.id}>
                      {meter.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Box>
            <TextField
              label="Month"
              type="number"
              fullWidth
              required
              disabled={isPending}
              slotProps={{ htmlInput: { min: 1, max: 12, step: 1 } }}
              error={Boolean(errors.periodMonth)}
              helperText={errors.periodMonth?.message}
              {...register('periodMonth', {
                setValueAs: (value) =>
                  value === '' || value === null ? undefined : Number(value),
              })}
            />
          </Box>
          <Box>
            <TextField
              label="Year"
              type="number"
              fullWidth
              required
              disabled={isPending}
              slotProps={{ htmlInput: { min: 2000, max: 2100, step: 1 } }}
              error={Boolean(errors.periodYear)}
              helperText={errors.periodYear?.message}
              {...register('periodYear', {
                setValueAs: (value) =>
                  value === '' || value === null ? undefined : Number(value),
              })}
            />
          </Box>
          <Box>
            <TextField
              label="Previous value"
              type="number"
              fullWidth
              disabled={isPending}
              slotProps={{ htmlInput: { min: 0, step: '0.001' } }}
              error={Boolean(errors.previousValue)}
              helperText={errors.previousValue?.message}
              {...register('previousValue', {
                setValueAs: (value) =>
                  value === '' || value === null ? undefined : Number(value),
              })}
            />
          </Box>
          <Box>
            <TextField
              label="Current value"
              type="number"
              fullWidth
              disabled={isPending}
              slotProps={{ htmlInput: { min: 0, step: '0.001' } }}
              error={Boolean(errors.currentValue)}
              helperText={errors.currentValue?.message}
              {...register('currentValue', {
                setValueAs: (value) =>
                  value === '' || value === null ? undefined : Number(value),
              })}
            />
          </Box>
          <Box>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Status"
                  select
                  fullWidth
                  disabled={isPending}
                  error={Boolean(errors.status)}
                  helperText={errors.status?.message}
                  {...field}
                  value={field.value ?? 'WAITING_FOR_TENANT'}
                >
                  {meterReadingStatusValues.map((status) => (
                    <MenuItem key={status} value={status}>
                      {statusLabels[status]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Box>
            <Stack spacing={1}>
              <Controller
                name="readingReceivedFromTenant"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        disabled={isPending}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                      />
                    }
                    label="Received from tenant"
                  />
                )}
              />
              <Controller
                name="submittedToProvider"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        disabled={isPending}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                      />
                    }
                    label="Submitted to provider"
                  />
                )}
              />
            </Stack>
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
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || meters.length === 0}
          >
            {isPending ? 'Saving...' : 'Save reading'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function applyActionErrors(
  result: MeterReadingActionState,
  setError: ReturnType<typeof useForm<MeterReadingFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof MeterReadingFormValues, { message });
      }
    });
  }
}
