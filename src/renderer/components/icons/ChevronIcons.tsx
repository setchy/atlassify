import type { ComponentType } from 'react';

import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import type { IconProps, NewIconProps } from '@atlaskit/icon/types';

import type { ChevronIconType } from '../../types';

// Props handed to IconButton icon renderers.
type ButtonIconProps =
  | Omit<IconProps, 'size'>
  | Omit<NewIconProps, 'spacing' | 'size'>;

function SmallChevronDownIcon(iconProps: ButtonIconProps) {
  return <ChevronDownIcon {...iconProps} size="small" />;
}

function SmallChevronRightIcon(iconProps: ButtonIconProps) {
  return <ChevronRightIcon {...iconProps} size="small" />;
}

/**
 * Maps each chevron direction to a hoisted small icon renderer so component
 * identities stay stable across re-renders.
 */
export const CHEVRON_ICONS: Record<
  ChevronIconType,
  ComponentType<ButtonIconProps>
> = {
  down: SmallChevronDownIcon,
  right: SmallChevronRightIcon,
};
