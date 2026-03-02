import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Constants } from '../constants';

import { useFiltersStore } from '../stores';

import { EmojiSplash } from './layout/EmojiSplash';

export const AllRead: FC = () => {
  const { t } = useTranslation();

  const hasFilters = useFiltersStore((s) => s.hasActiveFilters());

  const emoji = useMemo(
    () =>
      Constants.EMOJIS.ALL_READ[
        Math.floor(Math.random() * Constants.EMOJIS.ALL_READ.length)
      ],
    [],
  );

  const heading = hasFilters
    ? t('allRead.headingFiltered')
    : t('allRead.heading');

  return <EmojiSplash emoji={emoji} heading={heading} />;
};
