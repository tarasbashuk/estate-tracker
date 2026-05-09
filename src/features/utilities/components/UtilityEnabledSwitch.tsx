'use client';

import { useTransition } from 'react';
import { FormControlLabel, Switch } from '@mui/material';

import { setPropertyUtilityConfigEnabledAction } from '@/app/actions/utilities';

type UtilityEnabledSwitchProps = {
  propertyId: string;
  configId: string;
  isEnabled: boolean;
};

export function UtilityEnabledSwitch({
  propertyId,
  configId,
  isEnabled,
}: UtilityEnabledSwitchProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isEnabled}
          disabled={isPending}
          onChange={(event) => {
            const nextValue = event.target.checked;

            startTransition(async () => {
              await setPropertyUtilityConfigEnabledAction(
                propertyId,
                configId,
                nextValue,
              );
            });
          }}
        />
      }
      label={isEnabled ? 'Enabled' : 'Disabled'}
    />
  );
}
