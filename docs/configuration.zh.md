---
title: 配置
order: 20
---

# 配置

主题通过 [Vited Core](https://github.com/vitedjs/core) 的 `docs` 选项进行配置，
没有主题专属的选项。

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

## 标题、描述和网站图标

`title` 和 `description` 显示在页头中，旁边是 Vited 从文档目录中发现的网站图标。项目
`package.json` 中的 `version` 会以小号弱化文字显示在标题后面。

## 多语言

当 `supportedLocales` 包含多个语言时，页头会显示语言菜单，界面文本（搜索、
导航、色彩模式切换）会在内置的英文和简体中文翻译之间切换。

## 搜索

搜索弹窗会索引当前语言下每个页面的标题和内容，支持模糊匹配，包括中文文本。
使用搜索按钮或 `Ctrl+K` / `⌘K` 打开，用方向键在结果间移动，按 `Enter` 确认。

## 色彩模式

在用户通过页头按钮选择明暗模式之前，主题跟随系统色彩方案。用户的显式选择会
持久化到 `localStorage`，并通过 Fluent 的 `webLightTheme` 和 `webDarkTheme`
应用，因此所有 Fluent 组件都会自动适配。

## 导航和目录

生成的导航在宽屏下显示为侧边栏，在小屏幕下显示为抽屉。页面目录在宽屏下保持
可见，在较小的屏幕上通过浮动按钮打开。

## 项目链接

当传给主题的 `package.json` 包含 GitHub `repository` URL 或 `funding` URL 时，
对应的链接会以图标按钮的形式显示在页头中。

## 代码高亮

代码块使用 Shiki 的 GitHub 明暗双主题进行高亮。预加载语言：`bash`、`css`、
`diff`、`html`、`javascript`、`json`、`jsx`、`markdown`、`mdx`、`shellscript`、
`typescript`、`tsx` 和 `yaml`；其他语言回退为纯文本。
