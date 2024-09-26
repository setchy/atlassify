import { type FC, useMemo } from 'react';

import { Stack } from '@atlaskit/primitives';

import { Constants } from '../utils/constants';
import { Centered } from './primitives/Centered';
import { EmojiText } from './primitives/EmojiText';

export const AllRead: FC = () => {
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
        <span className="text-xl font-semibold">No new notifications</span>
      </Stack>
    </Centered>
  );
};
