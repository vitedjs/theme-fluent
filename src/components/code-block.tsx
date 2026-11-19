import { useEffect, useState, type ReactElement } from 'react';
import type { BundledLanguage } from 'shiki';

import { getHighlighter } from '../code-highlight';
import { useColorSchemeContext } from '../color-scheme-context';
import { CopyButton } from './copy-button';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language }: CodeBlockProps): ReactElement {
  const colorScheme = useColorSchemeContext();
  const shikiTheme = colorScheme === 'dark' ? 'github-dark' : 'github-light';
  const [html, setHtml] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    getHighlighter()
      .then((highlighter) => {
        if (cancelled) return;
        const normalized = language?.toLowerCase();
        const lang = (
          normalized && highlighter.getLoadedLanguages().includes(normalized) ? normalized : 'text'
        ) as BundledLanguage;
        setHtml(
          highlighter.codeToHtml(code, {
            lang,
            theme: shikiTheme,
          }),
        );
      })
      .catch(() => {
        // Highlighting is best-effort; the plain code fallback stays visible.
      });
    return () => {
      cancelled = true;
    };
  }, [code, language, shikiTheme]);

  return (
    <div className='vf-code-block'>
      <CopyButton code={code} />
      {html ? (
        <div className='vf-code' dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className='vf-code-plain'>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
