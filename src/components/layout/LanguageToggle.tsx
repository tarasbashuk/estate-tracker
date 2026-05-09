'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import {
  dictionary,
  localeCookieName,
  type Locale,
} from '@/lib/i18n';

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const labels = dictionary[locale].language;

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={locale}
      aria-label={labels.label}
      disabled={isPending}
      onChange={(_, nextLocale: Locale | null) => {
        if (!nextLocale || nextLocale === locale) return;

        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        startTransition(() => {
          router.refresh();
        });
      }}
    >
      <ToggleButton value="en" aria-label={labels.english}>
        {labels.english}
      </ToggleButton>
      <ToggleButton value="uk" aria-label={labels.ukrainian}>
        {labels.ukrainian}
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
