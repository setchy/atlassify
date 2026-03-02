import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Constants } from '../constants';

import { EmojiSplash } from './layout/EmojiSplash';

export const Loading: FC = () => {
  const { t } = useTranslation();

  const emoji = useMemo(
    () =>
      Constants.EMOJIS.LOADING[
        Math.floor(Math.random() * Constants.EMOJIS.LOADING.length)
      ],
    [],
  );

  return <EmojiSplash emoji={emoji} heading={t('loading.heading')} />;
};
