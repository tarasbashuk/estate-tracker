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

import { createMonthlyStatementAction } from '@/app/actions/statements';
import {
  createStatementSchema,
  statementStatusValues,
  type CreateStatementFormValues,
  type StatementActionState,
} from '@/features/statements/schemas';

export type StatementPropertyOption = {
  id: string;
  name: string;
};

type CreateStatementFormProps = {
  properties: StatementPropertyOption[];
  defaultValues?: Partial<CreateStatementFormValues>;
  onSuccess?: () => void;
};

const statusLabels: Record<(typeof statementStatusValues)[number], string> = {
  DRAFT: 'Draft',
  READY_TO_SEND: 'Ready to send',
  SENT: 'Sent',
  CANCELLED: 'Cancelled',
};

const today = new Date();

const defaultStatementValues: CreateStatementFormValues = {
  propertyId: '',
  periodMonth: today.getMonth() + 1,
  periodYear: today.getFullYear(),
  dueDate: today.toISOString().slice(0, 10),
  status: 'DRAFT',
  notes: '',
};

export function CreateStatementForm({
  properties,
  defaultValues,
  onSuccess,
}: CreateStatementFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateStatementFormValues>({
    resolver: zodResolver(createStatementSchema),
    defaultValues: {
      ...defaultStatementValues,
      propertyId: properties[0]?.id ?? '',
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createMonthlyStatementAction(values);

      if (!result.ok) {
        applyActionErrors(result, setError);
        return;
      }

      reset({
        ...defaultStatementValues,
        propertyId: properties[0]?.id ?? '',
        ...defaultValues,
      });
      onSuccess?.();
      router.push(result.statementId ? `/statements/${result.statementId}` : '/statements');
      router.refresh();
    });
  });

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={3}>
        {errors.root?.message && (
          <Alert severity="error">{errors.root.message}</Alert>
        )}

        {properties.length === 0 ? (
          <Alert severity="warning">
            Create a property and active rental agreement before creating a
            monthly statement.
          </Alert>
        ) : null}

        <Controller
          name="propertyId"
          control={control}
          render={({ field }) => (
            <TextField
              label="Property"
              select
              fullWidth
              required
              disabled={isPending || properties.length === 0}
              error={Boolean(errors.propertyId)}
              helperText={errors.propertyId?.message}
              {...field}
              value={field.value ?? ''}
            >
              {properties.map((property) => (
                <MenuItem key={property.id} value={property.id}>
                  {property.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          }}
        >
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
                value={field.value ?? 'DRAFT'}
              >
                {statementStatusValues.map((status) => (
                  <MenuItem key={status} value={status}>
                    {statusLabels[status]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>

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
            disabled={isPending || properties.length === 0}
          >
            {isPending ? 'Creating...' : 'Create statement'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

function applyActionErrors(
  result: StatementActionState,
  setError: ReturnType<typeof useForm<CreateStatementFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof CreateStatementFormValues, { message });
      }
    });
  }
}
