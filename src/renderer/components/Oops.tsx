import { type FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@atlaskit/button/new';

import { EmojiSplash } from './layout/EmojiSplash';

import type { AtlassifyError } from '../types';

import { Errors } from '../utils/core/errors';
import { randomElement } from '../utils/core/random';

interface OopsProps {
  error: AtlassifyError;
}

export const Oops: FC<OopsProps> = ({ error }: OopsProps) => {
  const navigate = useNavigate();

  const err = error ?? Errors.UNKNOWN;

  const emoji = useMemo(() => randomElement(err.emojis), [err]);

  const actions = err.actions?.length
    ? err.actions.map((action) => (
        <Button
          appearance={action.appearance}
          key={action.route}
          onClick={() => navigate(action.route)}
        >
          <span className="font-medium">{action.label}</span>
        </Button>
      ))
    : null;

  return (
    <EmojiSplash
      actions={actions}
      emoji={emoji}
      heading={err.title}
      subHeadings={err.descriptions}
    />
  );
};
