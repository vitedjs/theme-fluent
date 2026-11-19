---
title: Configuration
order: 20
---

# Configuration

The theme is configured through the `docs` option of
[Vited Core](https://github.com/vitedjs/core); there are no theme-specific
options.

```ts
import { defineConfig } from '@vited/core';

export default defineConfig({
  docs: {
    title: 'My Cool Library',
    description: 'Documentation for My Cool Library',
    supportedLocales: ['en', 'zh'],
    theme: '@vited/theme-fluent',
  },
});
```

## Title, description and favicon

`title` and `description` appear in the header, next to the favicon that Vited
discovers from your docs directory. The `version` from your project's
`package.json` is shown in small, muted text after the title.

## Locales

When `supportedLocales` lists more than one locale, a language menu appears in
the header and the interface labels (search, navigation, color mode toggle)
switch between the bundled English and Simplified Chinese translations.

## Search

The search dialog indexes the title and content of every page in the current
locale and supports fuzzy matching, including Chinese text. Open it with the
Search button or `Ctrl+K` / `⌘K`, move through results with the arrow keys, and
confirm with `Enter`.

## Color modes

The theme follows the system color scheme until the user picks light or dark
with the header toggle. The explicit choice is persisted in `localStorage` and
applied through Fluent's `webLightTheme` and `webDarkTheme`, so all Fluent
components adapt automatically.

## Navigation and table of contents

Generated navigation is shown in a sidebar on wide screens and in an overlay
drawer on small screens. The page outline in the table of contents stays in
view on wide screens and opens from a floating button on smaller ones.

## Project links

When the `package.json` passed to the theme contains a GitHub `repository` URL
or a `funding` URL, the corresponding links are shown as icon buttons in the
header.

## Code highlighting

Fenced code blocks are highlighted with Shiki using the GitHub light and dark
themes. Preloaded languages: `bash`, `css`, `diff`, `html`, `javascript`,
`json`, `jsx`, `markdown`, `mdx`, `shellscript`, `typescript`, `tsx` and
`yaml`; other languages fall back to plain text.
