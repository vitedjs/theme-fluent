import type { Config } from 'stylelint';

export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Fluent UI design tokens are camelCase custom properties.
    'custom-property-pattern': null,
  },
} satisfies Config;
