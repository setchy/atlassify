import { type FC, useMemo } from 'react';

import { EmojiSplash } from './layout/EmojiSplash';

import type { AtlassifyError } from '../types';

import { Errors } from '../utils/errors';

interface OopsProps {
  error: AtlassifyError;
}

export const Oops: FC<OopsProps> = ({ error }: OopsProps) => {
  const err = error ?? Errors.UNKNOWN;

  const emoji = useMemo(
    () => err.emojis[Math.floor(Math.random() * err.emojis.length)],
    [err],
  );

  return (
    <EmojiSplash
      emoji={emoji}
      heading={err.title}
      subHeadings={err.descriptions}
    />
  );
};
