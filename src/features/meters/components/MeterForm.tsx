'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from '@mui/material';

import { createMeterAction } from '@/app/actions/meters';
import {
  meterSchema,
  submissionMethodValues,
  type MeterFormActionState,
  type MeterFormValues,
} from '@/features/meters/schemas';

export type MeterUtilityTypeOption = {
  id: string;
  name: string;
};

type MeterFormProps = {
  propertyId: string;
  utilityTypes: MeterUtilityTypeOption[];
  defaultValues?: Partial<MeterFormValues>;
  submitLabel?: string;
  onSubmitAction?: (values: MeterFormValues) => Promise<MeterFormActionState>;
  onSuccess?: () => void;
};

const submissionMethodLabels: Record<
  (typeof submissionMethodValues)[number],
  string
> = {
  WEBSITE: 'Website',
  EMAIL: 'Email',
  PHONE: 'Phone',
  MESSENGER: 'Messenger',
  IN_PERSON: 'In person',
  OTHER: 'Other',
};

const defaultMeterValues: MeterFormValues = {
  utilityTypeId: '',
  name: '',
  providerName: '',
  accountNumber: '',
  submissionMethod: 'OTHER',
  submissionUrl: '',
  submissionEmail: '',
  notes: '',
  isActive: true,
};

export function MeterForm({
  propertyId,
  utilityTypes,
  defaultValues,
  submitLabel = 'Save meter',
  onSubmitAction = (values) => createMeterAction(propertyId, values),
  onSuccess,
}: MeterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<MeterFormValues>({
    resolver: zodResolver(meterSchema),
    defaultValues: {
      ...defaultMeterValues,
      utilityTypeId: utilityTypes[0]?.id ?? '',
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

      reset({
        ...defaultMeterValues,
        utilityTypeId: utilityTypes[0]?.id ?? '',
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

        {utilityTypes.length === 0 ? (
          <Alert severity="warning">
            Add a utility type before creating meters.
          </Alert>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          }}
        >
          <Box>
            <TextField
              label="Meter name"
              fullWidth
              required
              disabled={isPending}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register('name')}
            />
          </Box>
          <Box>
            <Controller
              name="utilityTypeId"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Utility type"
                  select
                  fullWidth
                  required
                  disabled={isPending || utilityTypes.length === 0}
                  error={Boolean(errors.utilityTypeId)}
                  helperText={errors.utilityTypeId?.message}
                  {...field}
                  value={field.value ?? ''}
                >
                  {utilityTypes.map((utilityType) => (
                    <MenuItem key={utilityType.id} value={utilityType.id}>
                      {utilityType.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Box>
            <TextField
              label="Provider"
              fullWidth
              disabled={isPending}
              error={Boolean(errors.providerName)}
              helperText={errors.providerName?.message}
              {...register('providerName')}
            />
          </Box>
          <Box>
            <TextField
              label="Account number"
              fullWidth
              disabled={isPending}
              error={Boolean(errors.accountNumber)}
              helperText={errors.accountNumber?.message}
              {...register('accountNumber')}
            />
          </Box>
          <Box>
            <Controller
              name="submissionMethod"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Submission method"
                  select
                  fullWidth
                  disabled={isPending}
                  error={Boolean(errors.submissionMethod)}
                  helperText={errors.submissionMethod?.message}
                  {...field}
                  value={field.value ?? 'OTHER'}
                >
                  {submissionMethodValues.map((method) => (
                    <MenuItem key={method} value={method}>
                      {submissionMethodLabels[method]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          <Box>
            <TextField
              label="Submission URL"
              fullWidth
              disabled={isPending}
              error={Boolean(errors.submissionUrl)}
              helperText={errors.submissionUrl?.message}
              {...register('submissionUrl')}
            />
          </Box>
          <Box>
            <TextField
              label="Submission email"
              fullWidth
              disabled={isPending}
              error={Boolean(errors.submissionEmail)}
              helperText={errors.submissionEmail?.message}
              {...register('submissionEmail')}
            />
          </Box>
          <Box>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Day from"
                type="number"
                fullWidth
                disabled={isPending}
                slotProps={{ htmlInput: { min: 1, max: 31, step: 1 } }}
                error={Boolean(errors.submissionDayStart)}
                helperText={errors.submissionDayStart?.message}
                {...register('submissionDayStart', {
                  setValueAs: (value) =>
                    value === '' || value === null ? undefined : Number(value),
                })}
              />
              <TextField
                label="Day to"
                type="number"
                fullWidth
                disabled={isPending}
                slotProps={{ htmlInput: { min: 1, max: 31, step: 1 } }}
                error={Boolean(errors.submissionDayEnd)}
                helperText={errors.submissionDayEnd?.message}
                {...register('submissionDayEnd', {
                  setValueAs: (value) =>
                    value === '' || value === null ? undefined : Number(value),
                })}
              />
            </Stack>
          </Box>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      disabled={isPending}
                      onChange={(event) =>
                        field.onChange(event.target.checked)
                      }
                    />
                  }
                  label="Active meter"
                />
              )}
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
          <Button
            type="submit"
            variant="contained"
            disabled={isPending || utilityTypes.length === 0}
          >
            {isPending ? 'Saving...' : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function applyActionErrors(
  result: MeterFormActionState,
  setError: ReturnType<typeof useForm<MeterFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof MeterFormValues, { message });
      }
    });
  }
}
