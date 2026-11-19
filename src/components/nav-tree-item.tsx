import { ChevronDownRegular, ChevronUpRegular } from '@fluentui/react-icons';
import { Children, useState, type ReactElement, type ReactNode } from 'react';
import { Link } from 'wouter';

interface NavTreeItemProps {
  label: ReactNode;
  active?: boolean;
  defaultOpened?: boolean;
  /** Internal route rendered with the client router. */
  to?: string;
  /** External link rendered as a plain anchor. */
  href?: string;
  onNavigate: () => void;
  children?: ReactNode;
}

export function NavTreeItem({
  label,
  active = false,
  defaultOpened = false,
  to,
  href,
  onNavigate,
  children,
}: NavTreeItemProps): ReactElement {
  const [opened, setOpened] = useState(defaultOpened);
  const hasChildren = Children.count(children) > 0;
  const handleClick = () => {
    if (hasChildren) setOpened((value) => !value);
    onNavigate();
  };
  const className = active ? 'vf-nav-item vf-nav-item-active' : 'vf-nav-item';
  const content = (
    <>
      <span className='vf-nav-item-label'>{label}</span>
      {hasChildren ? (
        opened ? (
          <ChevronUpRegular className='vf-nav-chevron' />
        ) : (
          <ChevronDownRegular className='vf-nav-chevron' />
        )
      ) : undefined}
    </>
  );

  let control: ReactElement;
  if (to) {
    control = (
      <Link asChild to={to}>
        <a
          className={className}
          href={to}
          aria-expanded={hasChildren ? opened : undefined}
          onClick={handleClick}
        >
          {content}
        </a>
      </Link>
    );
  } else if (href) {
    control = (
      <a
        className={className}
        href={href}
        target='_blank'
        rel='noreferrer'
        aria-expanded={hasChildren ? opened : undefined}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  } else {
    control = (
      <button
        className={className}
        type='button'
        aria-expanded={hasChildren ? opened : undefined}
        onClick={handleClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div className='vf-nav-tree-item'>
      {control}
      {hasChildren && opened ? <div className='vf-nav-children'>{children}</div> : undefined}
    </div>
  );
}
