import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Constants } from '../constants';

import { EmojiSplash } from './layout/EmojiSplash';

import { randomIndex } from '../utils/random';

export const Loading: FC = () => {
  const { t } = useTranslation();

  const emoji = useMemo(
    () =>
      Constants.EMOJIS.LOADING[randomIndex(Constants.EMOJIS.LOADING.length)],
    [],
  );

  return <EmojiSplash emoji={emoji} heading={t('loading.heading')} />;
};
