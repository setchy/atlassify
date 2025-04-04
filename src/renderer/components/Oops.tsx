import { type FC, useMemo } from 'react';

import type { AtlassifyError } from '../types';
import { Errors } from '../utils/errors';
import { EmojiSplash } from './layout/EmojiSplash';

interface IOops {
  error: AtlassifyError;
}

export const Oops: FC<IOops> = ({ error }: IOops) => {
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
