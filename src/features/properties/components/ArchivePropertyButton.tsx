'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

import { archivePropertyAction } from '@/app/actions/properties';

export function ArchivePropertyButton({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleArchive = () => {
    const confirmed = window.confirm(
      'Archive this property? It will be hidden from the active property list.',
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await archivePropertyAction(propertyId);

      if (result.ok) {
        router.push('/properties');
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
      {isPending ? 'Archiving...' : 'Archive property'}
    </Button>
  );
}

