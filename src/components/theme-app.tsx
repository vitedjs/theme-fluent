import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tooltip,
} from '@fluentui/react-components';
import {
  CheckmarkRegular,
  ChevronDownRegular,
  DismissRegular,
  HeartRegular,
  LocalLanguageRegular,
  NavigationRegular,
  SearchRegular,
  TextBulletListLtrRegular,
} from '@fluentui/react-icons';
import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollRestore } from 'react-scroll-restore';
import { useLocation } from 'wouter';

import { formatDocumentTitle } from '../document-title';
import { formatPackageVersion } from '../package-version';
import { getProjectLinks } from '../project-links';
import { createPageSearch } from '../search';
import { collectTocHeadings, useActiveHeading, type TocHeading } from '../toc';
import type { ColorScheme, MarkdownComponents, VitedThemeProps } from '../types';
import { ColorSchemeToggle } from './color-scheme-toggle';
import { GitHubIcon } from './icons';
import { MarkdownCodeBlock } from './markdown-code-block';
import { MarkdownHtml } from './markdown-html';
import { MenuItems } from './menu-items';
import { PageNavigation } from './page-navigation';
import { SearchDialog } from './search-dialog';
import { TocTree } from './toc-tree';

const emptyLocales: string[] = [];

export function ThemeApp({
  pages,
  routes,
  routeIndex,
  title = '',
  description = '',
  favicon = '',
  supportedLocales = emptyLocales,
  menu,
  searchIndex = [],
  packageJSON = {},
  basePath = '',
  colorScheme,
  onToggleColorScheme,
}: VitedThemeProps & {
  colorScheme: ColorScheme;
  onToggleColorScheme: () => void;
}): ReactElement {
  const locales = useMemo(
    () =>
      supportedLocales.length > 0
        ? supportedLocales
        : [...new Set(pages.map((item) => item.locale))],
    [pages, supportedLocales],
  );
  const [pathname, navigate] = useLocation();
  const route = routes[routeIndex[pathname] ?? -1];
  const locale = route?.locale ?? locales[0] ?? 'en';
  const Content = route ? pages[route.page].component : undefined;
  const pageTitle = route ? pages[route.page].title : '';
  const { t, i18n } = useTranslation();
  const [mobileOpened, setMobileOpened] = useState(false);
  const [tocOpened, setTocOpened] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);
  const [tocHeadings, setTocHeadings] = useState<TocHeading[]>([]);
  const activeHeadingId = useActiveHeading(tocHeadings);
  // Collect the outline when a page mounts; the keyed wrapper remounts on navigation.
  const attachContent = useCallback((element: HTMLDivElement | null) => {
    setTocHeadings(element ? collectTocHeadings(element) : []);
    if (element) setTocOpened(false);
  }, []);
  const projectLinks = useMemo(() => getProjectLinks(packageJSON), [packageJSON]);
  const version = formatPackageVersion(packageJSON);
  const navigationPages = useMemo(
    () => pages.filter((item) => item.locale === locale),
    [pages, locale],
  );
  // A single page needs no navigation, unless the site configures a menu of its own.
  const showNavigation = (menu?.length ?? 0) > 0 || navigationPages.length > 1;
  const markdownComponents = useMemo<MarkdownComponents>(
    () => ({ html: MarkdownHtml, pre: MarkdownCodeBlock }),
    [],
  );
  const searchPages = useMemo(
    () => searchIndex.filter((item) => item.locale.toLowerCase() === locale.toLowerCase()),
    [searchIndex, locale],
  );
  const search = useMemo(() => createPageSearch(searchPages), [searchPages]);
  const navigation = menu?.length ? (
    <MenuItems
      entries={menu}
      locale={locale}
      activePath={route?.path}
      onNavigate={() => setMobileOpened(false)}
    />
  ) : (
    <PageNavigation
      pages={navigationPages}
      activePath={route?.path}
      onNavigate={() => setMobileOpened(false)}
    />
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    void i18n.changeLanguage(locale);
  }, [i18n, locale]);

  useEffect(() => {
    document.title = formatDocumentTitle(pageTitle, title, packageJSON);
  }, [packageJSON, pageTitle, title]);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpened(true);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function changeLocale(nextLocale: string) {
    // Keep the reader on the same route when it exists in the next locale.
    const nextRoute =
      routes.find((item) => item.path === route?.path && item.locale === nextLocale) ??
      routes.find((item) => item.locale === nextLocale);
    if (!nextRoute) return;
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    navigate(`${nextRoute.pathname}${url.search}${url.hash}`);
  }

  // Route same-origin document links through the client router instead of a full page load.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      const routePath = stripBasePath(url.pathname, basePath);
      if (routeIndex[routePath] === undefined) return;
      event.preventDefault();
      navigate(`${routePath}${url.search}${url.hash}`);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [basePath, navigate, routeIndex]);

  const drawerNavigation = (
    <nav aria-label={t('navigation')} className='vf-nav'>
      {navigation}
    </nav>
  );

  return (
    <div className='vf-app'>
      <header className='vf-header'>
        <div className='vf-header-inner'>
          {showNavigation ? (
            <Button
              appearance='subtle'
              className='vf-nav-toggle'
              icon={mobileOpened ? <DismissRegular /> : <NavigationRegular />}
              aria-label={mobileOpened ? t('closeNavigation') : t('openNavigation')}
              aria-expanded={mobileOpened}
              onClick={() => setMobileOpened((opened) => !opened)}
            />
          ) : undefined}
          {favicon ? <img className='vf-logo' src={favicon} alt='' /> : undefined}
          <div className='vf-header-title-block'>
            <span className='vf-header-title'>
              {title || 'Documentation'}
              {version ? <span className='vf-header-version'> {version}</span> : undefined}
            </span>
            {description ? <span className='vf-header-description'>{description}</span> : undefined}
          </div>
          <div className='vf-header-actions'>
            {searchIndex.length > 0 ? (
              <Button
                appearance='outline'
                className='vf-search-trigger'
                icon={<SearchRegular />}
                aria-label={`${t('search')} ${getSearchShortcut()}`}
                aria-haspopup='dialog'
                onClick={() => setSearchOpened(true)}
              >
                <span className='vf-search-label'>{t('search')}</span>
                <kbd className='vf-kbd'>{getSearchShortcut()}</kbd>
              </Button>
            ) : undefined}
            {projectLinks.github ? (
              <Tooltip content={t('github')} relationship='description'>
                <Button
                  as='a'
                  appearance='subtle'
                  className='vf-header-action'
                  href={projectLinks.github}
                  target='_blank'
                  rel='noreferrer'
                  aria-label={t('github')}
                  icon={<GitHubIcon />}
                />
              </Tooltip>
            ) : undefined}
            {projectLinks.funding ? (
              <Tooltip content={t('donate')} relationship='description'>
                <Button
                  as='a'
                  appearance='subtle'
                  className='vf-header-action'
                  href={projectLinks.funding}
                  target='_blank'
                  rel='noreferrer'
                  aria-label={t('donate')}
                  icon={<HeartRegular className='vf-donate-icon' />}
                />
              </Tooltip>
            ) : undefined}
            {locales.length > 1 ? (
              <Menu>
                <MenuTrigger disableButtonEnhancement>
                  <Button
                    appearance='subtle'
                    className='vf-language-button'
                    icon={<LocalLanguageRegular />}
                    aria-label={t('language')}
                  >
                    <span className='vf-language-label'>{getLocaleName(locale)}</span>
                    <ChevronDownRegular className='vf-language-chevron' />
                  </Button>
                </MenuTrigger>
                <MenuPopover>
                  <MenuList>
                    {locales.map((item) => (
                      <MenuItem
                        key={item}
                        icon={item === locale ? <CheckmarkRegular /> : undefined}
                        onClick={() => changeLocale(item)}
                      >
                        {getLocaleName(item)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </MenuPopover>
              </Menu>
            ) : undefined}
            <ColorSchemeToggle scheme={colorScheme} onToggle={onToggleColorScheme} />
          </div>
        </div>
      </header>

      <div className='vf-body'>
        {showNavigation ? (
          <aside className='vf-sidebar' aria-label={t('navigation')}>
            <nav className='vf-sidebar-inner' aria-label={t('navigation')}>
              <span className='vf-nav-heading'>{t('navigation')}</span>
              <div className='vf-nav'>{navigation}</div>
            </nav>
          </aside>
        ) : undefined}

        <main className='vf-main'>
          <div className='vf-layout'>
            <div className='vf-article'>
              <ScrollRestore key={pathname} />
              {Content ? (
                <div className='vited-fluent-content' key={pathname} ref={attachContent}>
                  <Content components={markdownComponents} />
                </div>
              ) : (
                <p className='vf-empty'>{t('noDocuments')}</p>
              )}
            </div>
            <aside className='vf-toc-aside' aria-hidden={tocHeadings.length > 0 ? undefined : true}>
              <div className='vf-toc-inner'>
                {tocHeadings.length > 0 ? (
                  <>
                    <span className='vf-nav-heading'>{t('tableOfContents')}</span>
                    <nav aria-label={t('tableOfContents')}>
                      <TocTree
                        headings={tocHeadings}
                        activeId={activeHeadingId}
                        ariaLabel={t('tableOfContents')}
                      />
                    </nav>
                  </>
                ) : undefined}
              </div>
            </aside>
          </div>
        </main>
      </div>

      {showNavigation ? (
        <Drawer
          position='start'
          size='small'
          open={mobileOpened}
          onOpenChange={(_, data) => setMobileOpened(data.open)}
        >
          <DrawerHeader>
            <DrawerHeaderTitle
              action={
                <Button
                  appearance='subtle'
                  icon={<DismissRegular />}
                  aria-label={t('closeNavigation')}
                  onClick={() => setMobileOpened(false)}
                />
              }
            >
              {t('navigation')}
            </DrawerHeaderTitle>
          </DrawerHeader>
          <DrawerBody className='vf-drawer-body'>{drawerNavigation}</DrawerBody>
        </Drawer>
      ) : undefined}

      {tocHeadings.length > 0 ? (
        <>
          <Button
            appearance='primary'
            className='vf-toc-toggle'
            icon={<TextBulletListLtrRegular />}
            shape='circular'
            size='large'
            aria-label={tocOpened ? t('closeTableOfContents') : t('openTableOfContents')}
            aria-expanded={tocOpened}
            onClick={() => setTocOpened((opened) => !opened)}
          />
          <Drawer
            position='end'
            size='small'
            open={tocOpened}
            onOpenChange={(_, data) => setTocOpened(data.open)}
          >
            <DrawerHeader>
              <DrawerHeaderTitle
                action={
                  <Button
                    appearance='subtle'
                    icon={<DismissRegular />}
                    aria-label={t('closeTableOfContents')}
                    onClick={() => setTocOpened(false)}
                  />
                }
              >
                {t('tableOfContents')}
              </DrawerHeaderTitle>
            </DrawerHeader>
            <DrawerBody className='vf-drawer-body'>
              <nav aria-label={t('tableOfContents')}>
                <TocTree
                  headings={tocHeadings}
                  activeId={activeHeadingId}
                  ariaLabel={t('tableOfContents')}
                  onNavigate={() => setTocOpened(false)}
                />
              </nav>
            </DrawerBody>
          </Drawer>
        </>
      ) : undefined}

      {searchIndex.length > 0 ? (
        <SearchDialog
          open={searchOpened}
          search={search}
          onNavigate={(path) => {
            navigate(path);
            setMobileOpened(false);
          }}
          onClose={() => setSearchOpened(false)}
        />
      ) : undefined}
    </div>
  );
}

function getLocaleName(locale: string): string {
  return new Intl.DisplayNames([locale], { type: 'language' }).of(locale) ?? locale;
}

function getSearchShortcut(): string {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform)
    ? '⌘K'
    : 'Ctrl+K';
}

function stripBasePath(pathname: string, basePath: string): string {
  const base = basePath.replace(/\/$/, '');
  if (!base) return pathname;
  if (pathname === base) return '/';
  return pathname.startsWith(`${base}/`) ? pathname.slice(base.length) : pathname;
}
