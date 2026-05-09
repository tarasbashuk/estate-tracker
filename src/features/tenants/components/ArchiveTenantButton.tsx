'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

import { archiveTenantAction } from '@/app/actions/tenants';

export function ArchiveTenantButton({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleArchive = () => {
    const confirmed = window.confirm(
      'Archive this tenant? They will be hidden from the active tenant list.',
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await archiveTenantAction(tenantId);

      if (result.ok) {
        router.push('/tenants');
        router.refresh();
      }
    });
  };

  return (
    <Button
      color="error"
      variant="outlined"
      onClick={handleArchive}
      disabled={isPending}
    >
      {isPending ? 'Archiving...' : 'Archive tenant'}
    </Button>
  );
}

