import { createContext, useContext } from 'react';

import type { ColorScheme } from './types';

export const ColorSchemeContext = createContext<ColorScheme>('light');

/** The active color scheme, used by components that render outside the Fluent theme. */
export function useColorSchemeContext(): ColorScheme {
  return useContext(ColorSchemeContext);
}
