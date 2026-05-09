import Link from 'next/link';
import {
  Button,
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
import { calculateStatementTotal } from '@/features/statements/service';
import { StatementStatusChip } from './StatementStatusChip';

type StatementListItem = Prisma.MonthlyStatementGetPayload<{
  include: { property: true; tenant: true; items: true };
}>;

export function StatementList({
  statements,
}: {
  statements: StatementListItem[];
}) {
  if (statements.length === 0) {
    return (
      <EmptyState
        title="No monthly statements yet"
        description="Create a statement after a property has an active rental agreement."
      />
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Period</TableCell>
            <TableCell>Property</TableCell>
            <TableCell>Tenant</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statements.map((statement) => (
            <TableRow key={statement.id} hover>
              <TableCell>
                <Stack spacing={0.5}>
                  <Link href={`/statements/${statement.id}`}>
                    <Button
                      sx={{
                        p: 0,
                        minWidth: 0,
                        textAlign: 'left',
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {statement.periodMonth}/{statement.periodYear}
                    </Button>
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    Due {statement.dueDate.toLocaleDateString()}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>{statement.property.name}</TableCell>
              <TableCell>{statement.tenant.fullName}</TableCell>
              <TableCell>{calculateStatementTotal(statement.items).toString()}</TableCell>
              <TableCell>
                <StatementStatusChip status={statement.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
