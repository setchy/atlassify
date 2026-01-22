import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Constants } from '../constants';

import { useAppContext } from '../hooks/useAppContext';

import { EmojiSplash } from './layout/EmojiSplash';

import { hasActiveFilters } from '../utils/notifications/filters';

export const AllRead: FC = () => {
  const { settings } = useAppContext();

  const { t } = useTranslation();

  const hasFilters = hasActiveFilters(settings);

  const emoji = useMemo(
    () =>
      Constants.ALL_READ_EMOJIS[
        Math.floor(Math.random() * Constants.ALL_READ_EMOJIS.length)
      ],
    [],
  );

  const heading = hasFilters
    ? t('allRead.headingFiltered')
    : t('allRead.heading');

  return <EmojiSplash emoji={emoji} heading={heading} />;
};
