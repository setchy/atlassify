import type { FC } from 'react';

import { Box, Stack } from '@atlaskit/primitives/compiled';

import { EmojiText } from '../primitives/EmojiText';

import { Centered } from './Centered';

interface EmojiSplashProps {
  emoji: string;
  heading: string;
  subHeadings?: string[];
}

export const EmojiSplash: FC<EmojiSplashProps> = ({
  subHeadings = [],
  ...props
}: EmojiSplashProps) => {
  return (
    <Centered>
      <Box paddingInline="space.400">
        <Stack alignInline="center" space="space.300">
          <span className="text-5xl">
            <EmojiText text={props.emoji} />
          </span>

          <span className="text-xl font-semibold">{props.heading}</span>

          {subHeadings.length > 0 && (
            <Stack space="space.100">
              {subHeadings.map((description) => {
                return (
                  <span className="text-center" key={description}>
                    {description}
                  </span>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Box>
    </Centered>
  );
};
