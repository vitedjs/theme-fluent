# @vited/theme-fluent

The Fluent UI React v9 theme for Vited. It renders generated document pages
with `@fluentui/react-components`, provides responsive navigation in a header
and sidebar with overlay drawers on small screens, and includes a persisted
light/dark toggle backed by Fluent's `webLightTheme` and `webDarkTheme`.
Interface labels are available in English and Simplified Chinese; the language
menu appears when multiple locales are configured. These labels use
`react-i18next` resources in [`src/i18n.ts`](./src/i18n.ts). When supplied with
Vited's generated search index, it provides locale-aware fuzzy search in a
dialog, opened with the Search button or `Ctrl+K` / `⌘K`. GitHub and Donate
links are shown in the header when the supplied `packageJSON` includes valid
`repository` and `funding` URLs. The documentation favicon discovered by Vited
is displayed to the left of the header title. Markdown and MDX fenced code
blocks use Shiki syntax highlighting, with copy controls and translated copy
labels. The browser tab title shows the current page title followed by the site
title. Markdown and MDX headings show an anchor link on hover, and the page
outline is shown in a table of contents on the right of the content; on small
screens it opens from a floating button.

```ts
import { defineConfig } from '@vited/core';

export default defineConfig({
  docs: {
    title: 'My Cool Library',
    supportedLocales: ['en', 'zh'],
    theme: '@vited/theme-fluent',
  },
});
```

The theme is loaded by Vited's generated client; applications don't need to
render it manually. Fluent UI follows the system color scheme by default and
remembers the user's theme selection.
