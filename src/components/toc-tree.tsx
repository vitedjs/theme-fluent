import type { ReactElement } from 'react';

import type { TocHeading } from '../toc';

interface TocTreeProps {
  headings: TocHeading[];
  activeId?: string;
  ariaLabel: string;
  onNavigate?: () => void;
  depth?: number;
}

export function TocTree({
  headings,
  activeId,
  ariaLabel,
  onNavigate,
  depth = 0,
}: TocTreeProps): ReactElement {
  return (
    <ul
      className={depth === 0 ? 'vf-toc-list' : 'vf-toc-list vf-toc-sublist'}
      aria-label={depth === 0 ? ariaLabel : undefined}
    >
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            className={heading.id === activeId ? 'vf-toc-link vf-toc-link-active' : 'vf-toc-link'}
            href={`#${heading.id}`}
            aria-current={heading.id === activeId ? 'location' : undefined}
            style={{ paddingInlineStart: `${8 + (heading.level - 2) * 12}px` }}
            onClick={onNavigate}
          >
            {heading.text}
          </a>
          {heading.children.length > 0 ? (
            <TocTree
              headings={heading.children}
              activeId={activeId}
              ariaLabel={ariaLabel}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ) : undefined}
        </li>
      ))}
    </ul>
  );
}
