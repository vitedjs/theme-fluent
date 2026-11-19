import { defineConfig } from '@vited/core';

export default defineConfig({
  base: '/theme-fluent/',
  server: {
    open: true,
  },
  docs: {
    title: 'Vited Fluent Theme',
    supportedLocales: ['en', 'zh'],
    theme: '@vited/theme-fluent',
  },
});
