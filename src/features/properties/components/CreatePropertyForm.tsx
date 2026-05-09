'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { createPropertyAction } from '@/app/actions/properties';
import {
  propertySchema,
  propertyTypeValues,
  type PropertyActionState,
  type PropertyFormValues,
} from '@/features/properties/schemas';

const propertyTypeLabels: Record<(typeof propertyTypeValues)[number], string> =
  {
    APARTMENT: 'Apartment',
    HOUSE: 'House',
    COMMERCIAL: 'Commercial',
    OTHER: 'Other',
  };

export function CreatePropertyForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    reset,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: 'Ukraine',
      postalCode: '',
      propertyType: 'APARTMENT',
      notes: '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createPropertyAction(values);

      if (!result.ok) {
        applyActionErrors(result, setError);
        return;
      }

      reset();
      router.refresh();
    });
  });

  useEffect(() => {
    router.prefetch('/properties');
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
            Add property
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add the basic property details. Tenant and agreement setup comes
            later.
          </Typography>
        </Stack>

        {errors.root?.message && (
          <Alert severity="error">{errors.root.message}</Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Property name"
              fullWidth
              required
              disabled={isPending}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register('name')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Property type"
              select
              fullWidth
              disabled={isPending}
              error={Boolean(errors.propertyType)}
              helperText={errors.propertyType?.message}
              {...register('propertyType')}
            >
              {propertyTypeValues.map((value) => (
                <MenuItem key={value} value={value}>
                  {propertyTypeLabels[value]}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address line 1"
              fullWidth
              required
              disabled={isPending}
              error={Boolean(errors.addressLine1)}
              helperText={errors.addressLine1?.message}
              {...register('addressLine1')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address line 2"
              fullWidth
              disabled={isPending}
              error={Boolean(errors.addressLine2)}
              helperText={errors.addressLine2?.message}
              {...register('addressLine2')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="City"
              fullWidth
              required
              disabled={isPending}
              error={Boolean(errors.city)}
              helperText={errors.city?.message}
              {...register('city')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Country"
              fullWidth
              required
              disabled={isPending}
              error={Boolean(errors.country)}
              helperText={errors.country?.message}
              {...register('country')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Postal code"
              fullWidth
              disabled={isPending}
              error={Boolean(errors.postalCode)}
              helperText={errors.postalCode?.message}
              {...register('postalCode')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Area"
              type="number"
              fullWidth
              disabled={isPending}
              inputProps={{ min: 0, step: '0.01' }}
              error={Boolean(errors.area)}
              helperText={errors.area?.message}
              {...register('area', {
                setValueAs: (value) =>
                  value === '' || value === null ? undefined : Number(value),
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Rooms"
              type="number"
              fullWidth
              disabled={isPending}
              inputProps={{ min: 1, step: 1 }}
              error={Boolean(errors.rooms)}
              helperText={errors.rooms?.message}
              {...register('rooms', {
                setValueAs: (value) =>
                  value === '' || value === null ? undefined : Number(value),
              })}
            />
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end">
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? 'Saving...' : 'Create property'}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

function applyActionErrors(
  result: PropertyActionState,
  setError: ReturnType<typeof useForm<PropertyFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof PropertyFormValues, { message });
      }
    });
  }
}

