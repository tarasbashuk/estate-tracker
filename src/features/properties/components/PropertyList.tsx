import Link from 'next/link';
import { Property } from '@/generated/prisma/client';
import {
  Button,
  Chip,
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

import { EmptyState } from '@/components/feedback/EmptyState';

const propertyTypeLabels: Record<Property['propertyType'], string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  COMMERCIAL: 'Commercial',
  OTHER: 'Other',
};

export function PropertyList({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties yet"
        description="Create your first rental property to start replacing the spreadsheet workflow."
      />
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Rooms</TableCell>
            <TableCell align="right">Area</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id} hover>
              <TableCell>
                <Stack spacing={0.5}>
                  <Button
                    component={Link}
                    href={`/properties/${property.id}`}
                    sx={{
                      alignSelf: 'flex-start',
                      p: 0,
                      minWidth: 0,
                      textAlign: 'left',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {property.name}
                  </Button>
                  {property.notes ? (
                    <Typography variant="body2" color="text.secondary">
                      {property.notes}
                    </Typography>
                  ) : null}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography>{property.addressLine1}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[property.city, property.country]
                      .filter(Boolean)
                      .join(', ')}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Chip
                  label={propertyTypeLabels[property.propertyType]}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">{property.rooms ?? '-'}</TableCell>
              <TableCell align="right">
                {property.area ? `${property.area.toString()} m2` : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
