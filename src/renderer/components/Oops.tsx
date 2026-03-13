import { type FC, useMemo } from 'react';

import { EmojiSplash } from './layout/EmojiSplash';

import type { AtlassifyError } from '../types';

import { Errors } from '../utils/core/errors';
import { randomElement } from '../utils/core/random';

interface OopsProps {
  error: AtlassifyError;
}

export const Oops: FC<OopsProps> = ({ error }: OopsProps) => {
  const err = error ?? Errors.UNKNOWN;

  const emoji = useMemo(() => randomElement(err.emojis), [err]);

  return (
    <EmojiSplash
      emoji={emoji}
      heading={err.title}
      subHeadings={err.descriptions}
    />
  );
};
