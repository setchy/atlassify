import { type FC, useMemo } from 'react';

import { Box, Stack } from '@atlaskit/primitives';

import type { AtlassifyError } from '../types';
import { Centered } from './primitives/Centered';
import { EmojiText } from './primitives/EmojiText';

interface IOops {
  error: AtlassifyError;
}

export const Oops: FC<IOops> = ({ error }: IOops) => {
  const emoji = useMemo(
    () => error.emojis[Math.floor(Math.random() * error.emojis.length)],
    [error],
  );

  return (
    <Centered>
      <Box paddingBlockEnd="space.100">
        <Stack space="space.300" alignInline="center">
          <span className="text-5xl">
            <EmojiText text={emoji} />
          </span>

          <span className="text-xl font-semibold">{error.title}</span>
        </Stack>
      </Box>
      <Stack space="space.100">
        {error.descriptions.map((description) => {
          return (
            <span className="text-center" key={description}>
              {description}
            </span>
          );
        })}
      </Stack>
    </Centered>
  );
};
