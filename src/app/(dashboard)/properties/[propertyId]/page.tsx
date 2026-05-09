import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { ArchivePropertyButton } from '@/features/properties/components/ArchivePropertyButton';
import { EditPropertyForm } from '@/features/properties/components/EditPropertyForm';
import { getProperty } from '@/features/properties/service';
import type { PropertyFormValues } from '@/features/properties/schemas';
import { requireUser } from '@/server/requireUser';

const propertyTypeLabels = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  COMMERCIAL: 'Commercial',
  OTHER: 'Other',
} as const;

export const dynamic = 'force-dynamic';

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const user = await requireUser();
  const property = await getProperty(user.id, propertyId);

  if (!property) {
    notFound();
  }

  const formDefaults: PropertyFormValues = {
    name: property.name,
    addressLine1: property.addressLine1,
    addressLine2: property.addressLine2 ?? '',
    city: property.city,
    country: property.country,
    postalCode: property.postalCode ?? '',
    area: property.area ? property.area.toNumber() : undefined,
    rooms: property.rooms ?? undefined,
    propertyType: property.propertyType,
    notes: property.notes ?? '',
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack spacing={1}>
          <Link href="/properties">
            <Button sx={{ alignSelf: 'flex-start', p: 0, minWidth: 0 }}>
              Back to properties
            </Button>
          </Link>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              {property.name}
            </Typography>
            <Chip
              label={propertyTypeLabels[property.propertyType]}
              variant="outlined"
            />
          </Stack>
          <Typography color="text.secondary">
            {[property.addressLine1, property.city, property.country]
              .filter(Boolean)
              .join(', ')}
          </Typography>
        </Stack>
        <Box>
          <ArchivePropertyButton propertyId={property.id} />
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Overview
          </Typography>
          <Divider />
          <DetailRow label="Address line 1" value={property.addressLine1} />
          <DetailRow label="Address line 2" value={property.addressLine2} />
          <DetailRow label="City" value={property.city} />
          <DetailRow label="Country" value={property.country} />
          <DetailRow label="Postal code" value={property.postalCode} />
          <DetailRow
            label="Area"
            value={property.area ? `${property.area.toString()} m2` : null}
          />
          <DetailRow
            label="Rooms"
            value={property.rooms ? property.rooms.toString() : null}
          />
          <DetailRow label="Notes" value={property.notes} />
        </Stack>
      </Paper>

      <EditPropertyForm propertyId={property.id} defaultValues={formDefaults} />
    </Stack>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{ justifyContent: 'space-between' }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ fontWeight: 500 }}>{value || '-'}</Typography>
    </Stack>
  );
}
