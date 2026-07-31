import type { ComponentType } from 'react';

import type { NewCoreIconProps } from '@atlaskit/icon/base-new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import type { AlignBlock } from '@atlaskit/primitives/dist/types/components/types';

import { Constants } from '../../constants';

import type { Chevron, ChevronIconType } from '../../types';

import i18n from '../../i18n';

/**
 * Maps each `ChevronIconType` to its icon component. Guarantees `Chevron.icon`
 * can only ever resolve to one of these three, since the component types
 * themselves are structurally identical and can't be used to restrict this.
 */
export const CHEVRON_ICONS: Record<
  ChevronIconType,
  ComponentType<NewCoreIconProps>
> = {
  down: ChevronDownIcon,
  left: ChevronLeftIcon,
  right: ChevronRightIcon,
};

/**
 * Returns the appropriate chevron icon and accessible label for a collapsible section.
 *
 * @param hasNotifications - Whether the section has any notifications to display.
 * @param isVisible - Whether the section is currently expanded/visible.
 * @param type - The type of section (`'account'` or `'product'`).
 * @returns A `Chevron` object containing the icon component and its accessible label.
 */
export function getChevronDetails(
  hasNotifications: boolean,
  isVisible: boolean,
  type: 'account' | 'product',
): Chevron {
  let typeLocale: string;
  if (type === 'account') {
    typeLocale = i18n.t('common.account');
  } else {
    typeLocale = i18n.t('common.product');
  }

  if (!hasNotifications) {
    return {
      icon: 'left',
      label: i18n.t('chevron.none', { type: typeLocale }),
    };
  }

  if (isVisible) {
    return {
      icon: 'down',
      label: i18n.t('chevron.hide', { type: typeLocale }),
    };
  }

  return {
    icon: 'right',
    label: i18n.t('chevron.show', { type: typeLocale }),
  };
}

/**
 * Returns the Atlaskit block alignment based on the text length.
 * Long text uses `'start'` alignment; short text uses `'center'`.
 *
 * @param text - The text whose length determines alignment.
 * @returns `'start'` if the text exceeds the alignment threshold, `'center'` otherwise.
 */
export function blockAlignmentByLength(text: string): AlignBlock {
  return text?.length > Constants.BLOCK_ALIGNMENT_LENGTH_THRESHOLD
    ? 'start'
    : 'center';
}
