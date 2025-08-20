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
      aria-label="Unread Indicator"
      height={size}
      role="img"
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50%" cy="50%" fill={fillColor} r="4" />
    </svg>
  );
};
