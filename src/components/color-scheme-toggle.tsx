import { Button, Tooltip } from '@fluentui/react-components';
import { WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { ColorScheme } from '../types';

interface ColorSchemeToggleProps {
  scheme: ColorScheme;
  onToggle: () => void;
}

export function ColorSchemeToggle({ scheme, onToggle }: ColorSchemeToggleProps): ReactElement {
  const { t } = useTranslation();
  const label = scheme === 'dark' ? t('switchToLight') : t('switchToDark');
  return (
    <Tooltip content={label} relationship='description'>
      <Button
        appearance='subtle'
        icon={scheme === 'dark' ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
        aria-label={label}
        onClick={onToggle}
      />
    </Tooltip>
  );
}
