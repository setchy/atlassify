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
    ? t('allRead.headingFiltered')
    : t('allRead.heading');

  return <EmojiSplash emoji={emoji} heading={heading} />;
};
