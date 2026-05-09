import { notFound } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Link from 'next/link';

import { PrintButton } from '@/features/statements/components/PrintButton';
import { getMonthlyStatement } from '@/features/statements/service';
import { getTenantStatementTotals } from '@/features/statements/tenantSummary';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function StatementPrintPage({
  params,
}: {
  params: Promise<{ statementId: string }>;
}) {
  const { statementId } = await params;
  const user = await requireUser();
  const statement = await getMonthlyStatement(user.id, statementId);

  if (!statement) {
    notFound();
  }

  const { total, paid, remaining } = getTenantStatementTotals(statement);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        className="print-actions"
        sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}
      >
        <Link href={`/statements/${statement.id}`}>
          <Button variant="outlined">Back</Button>
        </Link>
        <PrintButton />
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          border: '1px solid',
          borderColor: 'divider',
          '@media print': {
            border: 0,
            boxShadow: 'none',
            p: 0,
          },
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h4" component="h1">
              Monthly Statement
            </Typography>
            <Typography color="text.secondary">
              {statement.periodMonth}/{statement.periodYear}
            </Typography>
          </Stack>

          <Divider />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ justifyContent: 'space-between' }}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Property
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {statement.property.name}
              </Typography>
              <Typography>{statement.property.addressLine1}</Typography>
              <Typography>{statement.property.city}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Tenant
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {statement.tenant.fullName}
              </Typography>
              <Typography>Due {statement.dueDate.toLocaleDateString()}</Typography>
            </Stack>
          </Stack>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statement.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>{item.notes || '-'}</TableCell>
                  <TableCell align="right">
                    {item.amount.toString()} {item.currency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Stack spacing={1} sx={{ alignItems: 'flex-end' }}>
            <SummaryRow label="Total" value={`${total.toString()} UAH`} />
            <SummaryRow label="Paid" value={`${paid.toString()} UAH`} />
            <SummaryRow
              label="Remaining"
              value={`${remaining.toString()} UAH`}
            />
          </Stack>

          {statement.notes ? (
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                Notes
              </Typography>
              <Typography>{statement.notes}</Typography>
            </Stack>
          ) : null}
        </Stack>
      </Paper>
    </Container>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={4}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ minWidth: 140, textAlign: 'right', fontWeight: 700 }}>
        {value}
      </Typography>
    </Stack>
  );
}
