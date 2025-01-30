import { type FC, useContext, useMemo } from 'react';

import { Stack } from '@atlaskit/primitives';

import { AppContext } from '../context/App';
import { Constants } from '../utils/constants';
import { hasAnyFiltersSet } from '../utils/notifications/filters/filter';
import { Centered } from './primitives/Centered';
import { EmojiText } from './primitives/EmojiText';

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

  return (
    <Centered>
      <Stack space="space.300" alignInline="center">
        <span className="text-5xl">
          <EmojiText text={emoji} />
        </span>
        {hasFilters ? (
          <span className="text-xl font-semibold">
            No new filtered notifications
          </span>
        ) : (
          <span className="text-xl font-semibold">No new notifications</span>
        )}
      </Stack>
    </Centered>
  );
};
