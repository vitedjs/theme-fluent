import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  Input,
} from '@fluentui/react-components';
import { DismissRegular, SearchRegular } from '@fluentui/react-icons';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { highlightText } from '../highlight-text';
import type { SearchDocument } from '../search';

interface SearchDialogProps {
  open: boolean;
  search: (query: string) => SearchDocument[];
  onNavigate: (pathname: string) => void;
  onClose: () => void;
}

export function SearchDialog({
  open,
  search,
  onNavigate,
  onClose,
}: SearchDialogProps): ReactElement {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(query).slice(0, 8), [search, query]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function handleClose() {
    setQuery('');
    setActiveIndex(0);
    onClose();
  }

  function select(item: SearchDocument) {
    onNavigate(item.pathname);
    handleClose();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      const item = results[activeIndex];
      if (item) select(item);
    }
  }

  return (
    <Dialog
      open={open}
      modalType='modal'
      onOpenChange={(_, data) => {
        if (!data.open) handleClose();
      }}
    >
      <DialogSurface className='vf-search-surface' aria-label={t('search')}>
        <DialogBody className='vf-search-body'>
          <div className='vf-search-header'>
            <Input
              className='vf-search-input'
              contentBefore={<SearchRegular />}
              contentAfter={
                <Button
                  appearance='transparent'
                  icon={<DismissRegular />}
                  size='small'
                  aria-label={t('close')}
                  onClick={handleClose}
                />
              }
              placeholder={t('searchPlaceholder')}
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onKeyDown}
            />
          </div>
          <DialogContent className='vf-search-results'>
            {results.length > 0 ? (
              results.map((item, index) => (
                <button
                  key={`${item.locale}:${item.pathname}`}
                  className={
                    index === activeIndex
                      ? 'vf-search-result vf-search-result-active'
                      : 'vf-search-result'
                  }
                  type='button'
                  onClick={() => select(item)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <span className='vf-search-result-title'>{highlightText(item.title, query)}</span>
                  <span className='vf-search-result-excerpt'>
                    {highlightText(item.content.slice(0, 140), query)}
                  </span>
                </button>
              ))
            ) : (
              <p className='vf-search-empty'>{t('noSearchResults')}</p>
            )}
          </DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
