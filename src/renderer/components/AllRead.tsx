import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Constants } from '../constants';

import { useFiltersStore } from '../stores';

import { EmojiSplash } from './layout/EmojiSplash';

import { randomElement } from '../utils/core/random';

export const AllRead: FC = () => {
  const { t } = useTranslation();

  const hasFilters = useFiltersStore((s) => s.hasActiveFilters());

  const emoji = useMemo(() => randomElement(Constants.EMOJIS.ALL_READ), []);

  const heading = hasFilters
    ? t('allRead.headingFiltered', {
        defaultValue: 'No new filtered notifications',
      })
    : t('allRead.heading', { defaultValue: 'No new notifications' });

  return <EmojiSplash emoji={emoji} heading={heading} />;
};
