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
import { AddMeterDialogButton } from './AddMeterDialogButton';
import { AddMeterReadingDialogButton } from './AddMeterReadingDialogButton';
import { EditMeterDialogButton } from './EditMeterDialogButton';
import { MeterReadingStatusChip } from './MeterReadingStatusChip';
import type { MeterUtilityTypeOption } from './MeterForm';

type MeterWithReadings = Prisma.MeterGetPayload<{
  include: { utilityType: true; readings: true };
}>;

type PropertyMetersSectionProps = {
  propertyId: string;
  meters: MeterWithReadings[];
  utilityTypes: MeterUtilityTypeOption[];
};

export function PropertyMetersSection({
  propertyId,
  meters,
  utilityTypes,
}: PropertyMetersSectionProps) {
  const meterOptions = meters
    .filter((meter) => meter.isActive)
    .map((meter) => ({ id: meter.id, name: meter.name }));

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
              Meters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track meters, monthly readings, tenant receipt, and provider
              submission.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <AddMeterReadingDialogButton
              propertyId={propertyId}
              meters={meterOptions}
            />
            <AddMeterDialogButton
              propertyId={propertyId}
              utilityTypes={utilityTypes}
            />
          </Stack>
        </Stack>

        <Divider />

        {meters.length === 0 ? (
          <EmptyState
            title="No meters yet"
            description="Add electricity, water, heating, gas, or other meters for this property."
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Meter</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell>Submission</TableCell>
                  <TableCell>Latest readings</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meters.map((meter) => (
                  <TableRow key={meter.id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {meter.name}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={meter.utilityType.name}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={meter.isActive ? 'Active' : 'Inactive'}
                            color={meter.isActive ? 'success' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography>{meter.providerName || '-'}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {meter.accountNumber || '-'}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography>{formatSubmissionMethod(meter.submissionMethod)}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatSubmissionWindow(
                            meter.submissionDayStart,
                            meter.submissionDayEnd,
                          )}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {meter.readings.length === 0 ? (
                        <Typography color="text.secondary">No readings</Typography>
                      ) : (
                        <Stack spacing={1}>
                          {meter.readings.map((reading) => (
                            <Stack key={reading.id} spacing={0.5}>
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ alignItems: 'center' }}
                              >
                                <Typography sx={{ fontWeight: 500 }}>
                                  {reading.periodMonth}/{reading.periodYear}
                                </Typography>
                                <MeterReadingStatusChip
                                  status={reading.status}
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary">
                                {formatReadingValues(reading)}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <EditMeterDialogButton
                        propertyId={propertyId}
                        meterId={meter.id}
                        utilityTypes={utilityTypes}
                        defaultValues={{
                          utilityTypeId: meter.utilityTypeId,
                          name: meter.name,
                          providerName: meter.providerName ?? '',
                          accountNumber: meter.accountNumber ?? '',
                          submissionMethod: meter.submissionMethod,
                          submissionUrl: meter.submissionUrl ?? '',
                          submissionEmail: meter.submissionEmail ?? '',
                          submissionDayStart:
                            meter.submissionDayStart ?? undefined,
                          submissionDayEnd: meter.submissionDayEnd ?? undefined,
                          notes: meter.notes ?? '',
                          isActive: meter.isActive,
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

function formatSubmissionMethod(method: string) {
  return method
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatSubmissionWindow(start: number | null, end: number | null) {
  if (start && end) return `Days ${start}-${end}`;
  if (start) return `From day ${start}`;
  if (end) return `By day ${end}`;

  return 'No schedule';
}

function formatReadingValues(
  reading: MeterWithReadings['readings'][number],
) {
  const previous = reading.previousValue?.toString() ?? '-';
  const current = reading.currentValue?.toString() ?? '-';
  const consumption = reading.consumption?.toString() ?? '-';

  return `Previous ${previous}, current ${current}, consumption ${consumption}`;
}
