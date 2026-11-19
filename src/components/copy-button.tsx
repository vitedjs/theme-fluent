import { Button, Tooltip } from '@fluentui/react-components';
import { CheckmarkRegular, CopyRegular } from '@fluentui/react-icons';
import { useEffect, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export function CopyButton({ code }: { code: string }): ReactElement {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Tooltip content={copied ? t('copied') : t('copy')} relationship='description'>
      <Button
        appearance='secondary'
        className='vf-copy-button'
        size='small'
        icon={copied ? <CheckmarkRegular /> : <CopyRegular />}
        aria-label={copied ? t('copied') : t('copy')}
        onClick={() => {
          if (typeof navigator !== 'undefined') {
            void navigator.clipboard?.writeText(code).catch(() => {});
          }
          setCopied(true);
        }}
      />
    </Tooltip>
  );
}
