import Link from 'next/link';
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import type { Prisma } from '@/generated/prisma/client';

import { EmptyState } from '@/components/feedback/EmptyState';
import { AgreementStatusChip } from './AgreementStatusChip';

type AgreementListItem = Prisma.RentalAgreementGetPayload<{
  include: { property: true; tenant: true };
}>;

export function RentalAgreementList({
  agreements,
}: {
  agreements: AgreementListItem[];
}) {
  if (agreements.length === 0) {
    return (
      <EmptyState
        title="No rental agreements yet"
        description="Create an agreement after you have at least one property and tenant."
      />
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Agreement</TableCell>
            <TableCell>Property</TableCell>
            <TableCell>Tenant</TableCell>
            <TableCell>Rent</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agreements.map((agreement) => (
            <TableRow key={agreement.id} hover>
              <TableCell>
                <Stack spacing={0.5}>
                  <Link href={`/agreements/${agreement.id}`}>
                    <Button
                      sx={{
                        p: 0,
                        minWidth: 0,
                        textAlign: 'left',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {formatDate(agreement.startDate)}
                      {agreement.endDate
                        ? ` - ${formatDate(agreement.endDate)}`
                        : ' - ongoing'}
                    </Button>
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    Due day {agreement.paymentDueDay}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>{agreement.property.name}</TableCell>
              <TableCell>{agreement.tenant.fullName}</TableCell>
              <TableCell>
                {agreement.monthlyRentAmount.toString()}{' '}
                {agreement.monthlyRentCurrency}
              </TableCell>
              <TableCell>
                <AgreementStatusChip status={agreement.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString();
}

