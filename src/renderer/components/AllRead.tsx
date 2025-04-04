import { type FC, useContext, useMemo } from 'react';

import { AppContext } from '../context/App';
import { Constants } from '../utils/constants';
import { hasAnyFiltersSet } from '../utils/notifications/filters/filter';
import { EmojiSplash } from './layout/EmojiSplash';

export const AllRead: FC = () => {
  const { settings } = useContext(AppContext);

  const hasFilters = hasAnyFiltersSet(settings);

  const emoji = useMemo(
    () =>
      Constants.ALL_READ_EMOJIS[
        Math.floor(Math.random() * Constants.ALL_READ_EMOJIS.length)
      ],
    [],
  );

  const heading = `No new ${hasFilters ? 'filtered ' : ''} notifications`;

  return <EmojiSplash emoji={emoji} heading={heading} />;
};
