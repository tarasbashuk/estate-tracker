import Link from 'next/link';
import { Tenant } from '@/generated/prisma/client';
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

const messengerTypeLabels: Record<Tenant['messengerType'], string> = {
  TELEGRAM: 'Telegram',
  WHATSAPP: 'WhatsApp',
  VIBER: 'Viber',
  EMAIL: 'Email',
  PHONE: 'Phone',
  OTHER: 'Other',
};

export function TenantList({ tenants }: { tenants: Tenant[] }) {
  if (tenants.length === 0) {
    return (
      <EmptyState
        title="No tenants yet"
        description="Create your first tenant to prepare for rental agreements."
      />
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Messenger</TableCell>
            <TableCell>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id} hover>
              <TableCell>
                <Link href={`/tenants/${tenant.id}`}>
                  <Button
                    sx={{
                      p: 0,
                      minWidth: 0,
                      textAlign: 'left',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {tenant.fullName}
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography>{tenant.phone || '-'}</Typography>
                  {tenant.email ? (
                    <Typography variant="body2" color="text.secondary">
                      {tenant.email}
                    </Typography>
                  ) : null}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Chip
                    label={messengerTypeLabels[tenant.messengerType]}
                    size="small"
                    variant="outlined"
                  />
                  {tenant.messengerHandle ? (
                    <Typography variant="body2" color="text.secondary">
                      {tenant.messengerHandle}
                    </Typography>
                  ) : null}
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {tenant.notes || '-'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
