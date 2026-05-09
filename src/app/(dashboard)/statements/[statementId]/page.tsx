import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Button,
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

import { StatementStatusChip } from '@/features/statements/components/StatementStatusChip';
import {
  calculateStatementTotal,
  getMonthlyStatement,
} from '@/features/statements/service';
import { requireUser } from '@/server/requireUser';

export const dynamic = 'force-dynamic';

export default async function StatementDetailsPage({
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

  const total = calculateStatementTotal(statement.items);

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Link href="/statements">
          <Button sx={{ alignSelf: 'flex-start', p: 0, minWidth: 0 }}>
            Back to statements
          </Button>
        </Link>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {statement.periodMonth}/{statement.periodYear}
          </Typography>
          <StatementStatusChip status={statement.status} />
        </Stack>
        <Typography color="text.secondary">
          {statement.property.name} · {statement.tenant.fullName}
        </Typography>
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
          <DetailRow label="Property" value={statement.property.name} />
          <DetailRow label="Tenant" value={statement.tenant.fullName} />
          <DetailRow
            label="Due date"
            value={statement.dueDate.toLocaleDateString()}
          />
          <DetailRow label="Total" value={`${total.toString()} UAH`} />
          <DetailRow label="Notes" value={statement.notes} />
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}
      >
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            Items
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statement.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatItemType(item.itemType)}</TableCell>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>{item.notes || '-'}</TableCell>
                  <TableCell align="right">
                    {item.amount.toString()} {item.currency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      </Paper>
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

function formatItemType(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
