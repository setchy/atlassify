import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Constants } from '../constants';

import { EmojiSplash } from './layout/EmojiSplash';

import { randomElement } from '../utils/core/random';

export const Loading: FC = () => {
  const { t } = useTranslation();

  const emoji = useMemo(() => randomElement(Constants.EMOJIS.LOADING), []);

  return <EmojiSplash emoji={emoji} heading={t('loading.heading')} />;
};
