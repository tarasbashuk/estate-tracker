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

import { ArchiveTenantButton } from '@/features/tenants/components/ArchiveTenantButton';
import { EditTenantForm } from '@/features/tenants/components/EditTenantForm';
import { getTenant } from '@/features/tenants/service';
import type { TenantFormValues } from '@/features/tenants/schemas';
import { requireUser } from '@/server/requireUser';

const messengerTypeLabels = {
  TELEGRAM: 'Telegram',
  WHATSAPP: 'WhatsApp',
  VIBER: 'Viber',
  EMAIL: 'Email',
  PHONE: 'Phone',
  OTHER: 'Other',
} as const;

export const dynamic = 'force-dynamic';

export default async function TenantDetailsPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const user = await requireUser();
  const tenant = await getTenant(user.id, tenantId);

  if (!tenant) {
    notFound();
  }

  const formDefaults: TenantFormValues = {
    fullName: tenant.fullName,
    phone: tenant.phone ?? '',
    email: tenant.email ?? '',
    messengerType: tenant.messengerType,
    messengerHandle: tenant.messengerHandle ?? '',
    notes: tenant.notes ?? '',
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between' }}
      >
        <Stack spacing={1}>
          <Link href="/tenants">
            <Button sx={{ alignSelf: 'flex-start', p: 0, minWidth: 0 }}>
              Back to tenants
            </Button>
          </Link>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
              {tenant.fullName}
            </Typography>
            <Chip
              label={messengerTypeLabels[tenant.messengerType]}
              variant="outlined"
            />
          </Stack>
          <Typography color="text.secondary">
            {[tenant.phone, tenant.email].filter(Boolean).join(' · ') ||
              'No contact details yet'}
          </Typography>
        </Stack>
        <Box>
          <ArchiveTenantButton tenantId={tenant.id} />
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
          <DetailRow label="Phone" value={tenant.phone} />
          <DetailRow label="Email" value={tenant.email} />
          <DetailRow
            label="Messenger"
            value={messengerTypeLabels[tenant.messengerType]}
          />
          <DetailRow label="Messenger handle" value={tenant.messengerHandle} />
          <DetailRow label="Notes" value={tenant.notes} />
        </Stack>
      </Paper>

      <EditTenantForm tenantId={tenant.id} defaultValues={formDefaults} />
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
