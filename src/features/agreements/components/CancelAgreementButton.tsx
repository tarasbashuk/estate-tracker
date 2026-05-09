'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

import { cancelRentalAgreementAction } from '@/app/actions/agreements';

export function CancelAgreementButton({
  agreementId,
}: {
  agreementId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    const confirmed = window.confirm('Cancel this rental agreement?');

    if (!confirmed) return;

    startTransition(async () => {
      const result = await cancelRentalAgreementAction(agreementId);

      if (result.ok) {
        router.refresh();
      }
    });
  };

  return (
    <Button
      color="error"
      variant="outlined"
      onClick={handleCancel}
      disabled={isPending}
    >
      {isPending ? 'Cancelling...' : 'Cancel agreement'}
    </Button>
  );
}

