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

import { createPropertyUtilityConfigAction } from '@/app/actions/utilities';
import {
  utilityConfigSchema,
  type UtilityConfigActionState,
  type UtilityConfigFormValues,
} from '@/features/utilities/schemas';

export type UtilityTypeOption = {
  id: string;
  name: string;
};

type UtilityConfigFormProps = {
  propertyId: string;
  utilityTypes: UtilityTypeOption[];
  defaultValues?: Partial<UtilityConfigFormValues>;
  submitLabel?: string;
  onSubmitAction?: (
    values: UtilityConfigFormValues,
  ) => Promise<UtilityConfigActionState>;
  onSuccess?: () => void;
};

const defaultConfigValues: UtilityConfigFormValues = {
  utilityTypeId: '',
  isEnabled: true,
  defaultAmount: undefined,
  notes: '',
};

export function UtilityConfigForm({
  propertyId,
  utilityTypes,
  defaultValues,
  submitLabel = 'Save utility',
  onSubmitAction = (values) =>
    createPropertyUtilityConfigAction(propertyId, values),
  onSuccess,
}: UtilityConfigFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<UtilityConfigFormValues>({
    resolver: zodResolver(utilityConfigSchema),
    defaultValues: {
      ...defaultConfigValues,
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
        ...defaultConfigValues,
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
            Create a utility type before adding property utilities.
          </Alert>
        ) : null}

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

        <Controller
          name="isEnabled"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  disabled={isPending}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              }
              label="Enabled for this property"
            />
          )}
        />

        <TextField
          label="Default amount"
          type="number"
          fullWidth
          disabled={isPending}
          slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          error={Boolean(errors.defaultAmount)}
          helperText={errors.defaultAmount?.message}
          {...register('defaultAmount', {
            setValueAs: (value) =>
              value === '' || value === null ? undefined : Number(value),
          })}
        />

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
  result: UtilityConfigActionState,
  setError: ReturnType<typeof useForm<UtilityConfigFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof UtilityConfigFormValues, { message });
      }
    });
  }
}
