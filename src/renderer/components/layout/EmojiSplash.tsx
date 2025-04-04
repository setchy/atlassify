import { Stack } from '@atlaskit/primitives';
import type { FC } from 'react';
import { EmojiText } from '../primitives/EmojiText';
import { Centered } from './Centered';

interface IEmojiSplash {
  emoji: string;
  heading: string;
  subHeadings?: string[];
}

export const EmojiSplash: FC<IEmojiSplash> = ({
  subHeadings = [],
  ...props
}: IEmojiSplash) => {
  return (
    <Centered>
      <Stack space="space.300" alignInline="center">
        <span className="text-5xl">
          <EmojiText text={props.emoji} />
        </span>
        <span className="text-xl font-semibold">{props.heading}</span>

        <Stack space="space.100">
          {subHeadings.map((description) => {
            return (
              <span className="text-center" key={description}>
                {description}
              </span>
            );
          })}
        </Stack>
      </Stack>
    </Centered>
  );
};
