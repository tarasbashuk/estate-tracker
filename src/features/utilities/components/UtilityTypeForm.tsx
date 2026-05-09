'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';

import { createUtilityTypeAction } from '@/app/actions/utilities';
import {
  utilityTypeSchema,
  type UtilityTypeActionState,
  type UtilityTypeFormValues,
} from '@/features/utilities/schemas';

type UtilityTypeFormProps = {
  propertyId: string;
  onSuccess?: () => void;
};

const defaultValues: UtilityTypeFormValues = {
  name: '',
  description: '',
};

export function UtilityTypeForm({ propertyId, onSuccess }: UtilityTypeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<UtilityTypeFormValues>({
    resolver: zodResolver(utilityTypeSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createUtilityTypeAction(propertyId, values);

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

        <TextField
          label="Name"
          fullWidth
          required
          disabled={isPending}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register('name')}
        />

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
            {isPending ? 'Saving...' : 'Create utility type'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function applyActionErrors(
  result: UtilityTypeActionState,
  setError: ReturnType<typeof useForm<UtilityTypeFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof UtilityTypeFormValues, { message });
      }
    });
  }
}
