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

import { createRentalAgreementAction } from '@/app/actions/agreements';
import {
  agreementStatusValues,
  currencyValues,
  rentalAgreementSchema,
  type RentalAgreementActionState,
  type RentalAgreementFormValues,
} from '@/features/agreements/schemas';

export type AgreementPropertyOption = {
  id: string;
  name: string;
};

export type AgreementTenantOption = {
  id: string;
  fullName: string;
};

const agreementStatusLabels: Record<
  (typeof agreementStatusValues)[number],
  string
> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  ENDED: 'Ended',
  CANCELLED: 'Cancelled',
};

type RentalAgreementFormProps = {
  properties: AgreementPropertyOption[];
  tenants: AgreementTenantOption[];
  defaultValues?: Partial<RentalAgreementFormValues>;
  submitLabel?: string;
  title?: string;
  description?: string;
  onSubmitAction?: (
    values: RentalAgreementFormValues,
  ) => Promise<RentalAgreementActionState>;
  onSuccess?: () => void;
  showHeader?: boolean;
  paper?: boolean;
};

const defaultAgreementValues: RentalAgreementFormValues = {
  propertyId: '',
  tenantId: '',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  status: 'ACTIVE',
  monthlyRentAmount: undefined as unknown as number,
  monthlyRentCurrency: 'UAH',
  paymentDueDay: 1,
  depositAmount: undefined,
  depositCurrency: 'UAH',
  notes: '',
};

export function RentalAgreementForm(props: RentalAgreementFormProps) {
  const {
    properties,
    tenants,
    defaultValues,
    submitLabel = 'Create agreement',
    title = 'Add rental agreement',
    description = 'Connect a property and tenant with rent and payment terms.',
    onSubmitAction = createRentalAgreementAction,
    onSuccess,
    showHeader = true,
    paper = true,
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
  } = useForm<RentalAgreementFormValues>({
    resolver: zodResolver(rentalAgreementSchema),
    defaultValues: {
      ...defaultAgreementValues,
      propertyId: properties[0]?.id ?? '',
      tenantId: tenants[0]?.id ?? '',
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
        ...defaultAgreementValues,
        propertyId: properties[0]?.id ?? '',
        tenantId: tenants[0]?.id ?? '',
        ...defaultValues,
      });
      onSuccess?.();
      router.refresh();
    });
  });

  useEffect(() => {
    router.prefetch('/agreements');
  }, [router]);

  const content = (
    <Stack spacing={3}>
      {showHeader ? (
        <Stack spacing={0.5}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Stack>
      ) : null}

      {errors.root?.message && (
        <Alert severity="error">{errors.root.message}</Alert>
      )}

      {(properties.length === 0 || tenants.length === 0) && (
        <Alert severity="warning">
          Create at least one property and one tenant before creating a rental
          agreement.
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        }}
      >
        <Box>
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
        </Box>
        <Box>
          <Controller
            name="tenantId"
            control={control}
            render={({ field }) => (
              <TextField
                label="Tenant"
                select
                fullWidth
                required
                disabled={isPending || tenants.length === 0}
                error={Boolean(errors.tenantId)}
                helperText={errors.tenantId?.message}
                {...field}
                value={field.value ?? ''}
              >
                {tenants.map((tenant) => (
                  <MenuItem key={tenant.id} value={tenant.id}>
                    {tenant.fullName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>
        <Box>
          <TextField
            label="Start date"
            type="date"
            fullWidth
            required
            disabled={isPending}
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.startDate)}
            helperText={errors.startDate?.message}
            {...register('startDate')}
          />
        </Box>
        <Box>
          <TextField
            label="End date"
            type="date"
            fullWidth
            disabled={isPending}
            slotProps={{ inputLabel: { shrink: true } }}
            error={Boolean(errors.endDate)}
            helperText={errors.endDate?.message}
            {...register('endDate')}
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
                value={field.value ?? 'ACTIVE'}
              >
                {agreementStatusValues.map((status) => (
                  <MenuItem key={status} value={status}>
                    {agreementStatusLabels[status]}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>
        <Box>
          <TextField
            label="Payment due day"
            type="number"
            fullWidth
            required
            disabled={isPending}
            slotProps={{ htmlInput: { min: 1, max: 31, step: 1 } }}
            error={Boolean(errors.paymentDueDay)}
            helperText={errors.paymentDueDay?.message}
            {...register('paymentDueDay', {
              setValueAs: (value) =>
                value === '' || value === null ? undefined : Number(value),
            })}
          />
        </Box>
        <Box>
          <TextField
            label="Monthly rent"
            type="number"
            fullWidth
            required
            disabled={isPending}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
            error={Boolean(errors.monthlyRentAmount)}
            helperText={errors.monthlyRentAmount?.message}
            {...register('monthlyRentAmount', {
              setValueAs: (value) =>
                value === '' || value === null ? undefined : Number(value),
            })}
          />
        </Box>
        <Box>
          <Controller
            name="monthlyRentCurrency"
            control={control}
            render={({ field }) => (
              <TextField
                label="Rent currency"
                select
                fullWidth
                disabled={isPending}
                error={Boolean(errors.monthlyRentCurrency)}
                helperText={errors.monthlyRentCurrency?.message}
                {...field}
                value={field.value ?? 'UAH'}
              >
                {currencyValues.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Box>
        <Box>
          <TextField
            label="Deposit"
            type="number"
            fullWidth
            disabled={isPending}
            slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
            error={Boolean(errors.depositAmount)}
            helperText={errors.depositAmount?.message}
            {...register('depositAmount', {
              setValueAs: (value) =>
                value === '' || value === null ? undefined : Number(value),
            })}
          />
        </Box>
        <Box>
          <Controller
            name="depositCurrency"
            control={control}
            render={({ field }) => (
              <TextField
                label="Deposit currency"
                select
                fullWidth
                disabled={isPending}
                error={Boolean(errors.depositCurrency)}
                helperText={errors.depositCurrency?.message}
                {...field}
                value={field.value ?? 'UAH'}
              >
                {currencyValues.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </TextField>
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
          disabled={isPending || properties.length === 0 || tenants.length === 0}
        >
          {isPending ? 'Saving...' : submitLabel}
        </Button>
      </Stack>
    </Stack>
  );

  if (!paper) {
    return (
      <Box component="form" onSubmit={onSubmit}>
        {content}
      </Box>
    );
  }

  return (
    <Paper
      component="form"
      onSubmit={onSubmit}
      elevation={0}
      sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
    >
      {content}
    </Paper>
  );
}

function applyActionErrors(
  result: RentalAgreementActionState,
  setError: ReturnType<typeof useForm<RentalAgreementFormValues>>['setError'],
) {
  if (result.formError) {
    setError('root', { message: result.formError });
  }

  if (result.fieldErrors) {
    Object.entries(result.fieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as keyof RentalAgreementFormValues, { message });
      }
    });
  }
}
