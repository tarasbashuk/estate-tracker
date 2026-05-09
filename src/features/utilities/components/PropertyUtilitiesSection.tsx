import {
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Prisma } from '@/generated/prisma/client';

import { EmptyState } from '@/components/feedback/EmptyState';
import { AddUtilityConfigDialogButton } from './AddUtilityConfigDialogButton';
import { AddUtilityTypeDialogButton } from './AddUtilityTypeDialogButton';
import { EditUtilityConfigDialogButton } from './EditUtilityConfigDialogButton';
import { UtilityEnabledSwitch } from './UtilityEnabledSwitch';
import type { UtilityTypeOption } from './UtilityConfigForm';

type UtilityConfig = Prisma.PropertyUtilityConfigGetPayload<{
  include: { utilityType: true };
}>;

type PropertyUtilitiesSectionProps = {
  propertyId: string;
  configs: UtilityConfig[];
  utilityTypes: UtilityTypeOption[];
};

export function PropertyUtilitiesSection({
  propertyId,
  configs,
  utilityTypes,
}: PropertyUtilitiesSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" component="h2">
              Utilities
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Utility rows configured here will be reused by meters and monthly
              statements.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <AddUtilityTypeDialogButton propertyId={propertyId} />
            <AddUtilityConfigDialogButton
              propertyId={propertyId}
              utilityTypes={utilityTypes}
            />
          </Stack>
        </Stack>

        <Divider />

        {configs.length === 0 ? (
          <EmptyState
            title="No utilities configured"
            description="Add rent-related utility rows such as electricity, water, heating, internet, or building maintenance."
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utility</TableCell>
                  <TableCell>Default amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {config.utilityType.name}
                        </Typography>
                        <Chip
                          label={config.utilityType.isSystem ? 'System' : 'Custom'}
                          size="small"
                          variant="outlined"
                          sx={{ alignSelf: 'flex-start' }}
                        />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {config.defaultAmount
                        ? `${config.defaultAmount.toString()} UAH`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <UtilityEnabledSwitch
                        propertyId={propertyId}
                        configId={config.id}
                        isEnabled={config.isEnabled}
                      />
                    </TableCell>
                    <TableCell>{config.notes || '-'}</TableCell>
                    <TableCell align="right">
                      <EditUtilityConfigDialogButton
                        propertyId={propertyId}
                        configId={config.id}
                        utilityTypes={utilityTypes}
                        defaultValues={{
                          utilityTypeId: config.utilityTypeId,
                          isEnabled: config.isEnabled,
                          defaultAmount: config.defaultAmount
                            ? config.defaultAmount.toNumber()
                            : undefined,
                          notes: config.notes ?? '',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Paper>
  );
}
