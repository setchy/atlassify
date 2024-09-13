import type { Size as AtlassianSize } from '@atlaskit/icon/dist/types/types';
import UserAvatarCircleIcon from '@atlaskit/icon/glyph/user-avatar-circle';
import type { FC } from 'react';
import { Size } from '../../types';
import { cn } from '../../utils/cn';

export interface IAvatarIcon {
  title: string;
  url: string | null;
  size: Size.XSMALL | Size.SMALL | Size.MEDIUM;
}

export const AvatarIcon: FC<IAvatarIcon> = (props: IAvatarIcon) => {
  if (props.url) {
    return (
      <img
        className={cn(
          'rounded-full object-cover',
          props.size === Size.XSMALL && 'size-4',
          props.size === Size.SMALL && 'size-5',
          props.size === Size.MEDIUM && 'size-6',
        )}
        src={props.url}
        alt={`${props.title}'s avatar`}
      />
    );
  }

  let defaultIconSize: AtlassianSize;
  switch (props.size) {
    case Size.XSMALL:
    case Size.SMALL:
      defaultIconSize = 'small';
      break;
    default:
      defaultIconSize = 'medium';
      break;
  }

  return <UserAvatarCircleIcon label="" size={defaultIconSize} />;
};
