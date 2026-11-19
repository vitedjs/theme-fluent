import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Router } from 'wouter';

import { ColorSchemeContext } from './color-scheme-context';
import { ThemeApp } from './components/theme-app';
import { themeI18n } from './i18n';
import type { VitedThemeProps } from './types';
import { useColorScheme } from './use-color-scheme';

import './index.css';

export type { VitedMenuEntry, VitedPage, VitedRoute, VitedThemeProps } from './types';

export function VitedTheme(props: VitedThemeProps): ReactElement {
  const [colorScheme, toggleColorScheme] = useColorScheme();
  return (
    <FluentProvider
      className='vited-fluent-root'
      theme={colorScheme === 'dark' ? webDarkTheme : webLightTheme}
    >
      <ColorSchemeContext.Provider value={colorScheme}>
        <I18nextProvider i18n={themeI18n}>
          <Router base={props.basePath ?? ''}>
            <ThemeApp
              {...props}
              colorScheme={colorScheme}
              onToggleColorScheme={toggleColorScheme}
            />
          </Router>
        </I18nextProvider>
      </ColorSchemeContext.Provider>
    </FluentProvider>
  );
}

export default VitedTheme;
