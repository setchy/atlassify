import type { FC } from 'react';

import { token } from '@atlaskit/tokens';

interface IUnreadIcon {
  size?: number;
  color?: 'brand' | 'default';
}

export const UnreadIcon: FC<IUnreadIcon> = ({
  size = 24,
  color = 'default',
}: IUnreadIcon) => {
  const fillColor =
    color === 'brand' ? token('color.icon.brand') : token('color.text');

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label="Unread Indicator"
    >
      <circle cx="50%" cy="50%" r="4" fill={fillColor} />
    </svg>
  );
};
