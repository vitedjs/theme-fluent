import type { ReactNode } from 'react';

export function highlightText(text: string, query: string): ReactNode {
  const needle = query.trim().toLowerCase();
  if (!needle) return text;
  const lower = text.toLowerCase();
  const parts: ReactNode[] = [];
  let index = 0;
  let found = lower.indexOf(needle);
  while (found !== -1) {
    if (found > index) parts.push(text.slice(index, found));
    parts.push(
      <mark className='vf-search-highlight' key={found}>
        {text.slice(found, found + needle.length)}
      </mark>,
    );
    index = found + needle.length;
    found = lower.indexOf(needle, index);
  }
  parts.push(text.slice(index));
  return parts;
}
