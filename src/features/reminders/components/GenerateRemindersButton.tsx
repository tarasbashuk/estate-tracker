'use client';

import { useState, useTransition } from 'react';
import { Button, Snackbar } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { generateAutomaticRemindersAction } from '@/app/actions/reminders';
import { useT } from '@/components/layout/LocaleProvider';

export function GenerateRemindersButton() {
  const t = useT();
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AutoAwesomeIcon />}
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await generateAutomaticRemindersAction();

            if (!result.ok) {
              setMessage(result.formError ?? t('Unable to generate reminders.'));
              return;
            }

            setMessage(
              result.createdCount === 0
                ? t('No new reminders needed.')
                : `${t('Created reminders')}: ${result.createdCount}`,
            );
          });
        }}
      >
        {isPending ? t('Generating...') : t('Generate reminders')}
      </Button>
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        message={message}
        onClose={() => setMessage('')}
      />
    </>
  );
}
