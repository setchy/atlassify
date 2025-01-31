import type { FC } from 'react';

import { token } from '@atlaskit/tokens';

token('color.icon.brand');
interface IUnreadIcon {
  width?: number;
  height?: number;
  color: 'brand' | 'default';
}

export const UnreadIcon: FC<IUnreadIcon> = ({
  width = 24,
  height = 24,
  color,
}: IUnreadIcon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    role="img"
    aria-label="Unread Indicator"
  >
    <circle
      cx="50%"
      cy="50%"
      r="4"
      fill={color === 'brand' ? token('color.icon.brand') : token('color.text')}
    />
  </svg>
);
