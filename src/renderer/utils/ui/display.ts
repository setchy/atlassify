import type { ComponentType } from 'react';

import type { NewCoreIconProps } from '@atlaskit/icon/base-new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import type { AlignBlock } from '@atlaskit/primitives/dist/types/components/types';

import { Constants } from '../../constants';

import type { Chevron, ChevronIconType } from '../../types';

import i18n from '../../i18n';

/**
 * Maps each `ChevronIconType` to its icon component. Guarantees `Chevron.icon`
 * can only ever resolve to one of these two, since the component types
 * themselves are structurally identical and can't be used to restrict this.
 */
export const CHEVRON_ICONS: Record<
  ChevronIconType,
  ComponentType<NewCoreIconProps>
> = {
  down: ChevronDownIcon,
  right: ChevronRightIcon,
};

/**
 * Returns the appropriate chevron icon and accessible label for a collapsible section.
 *
 * The icon always reflects the disclosure state: right when collapsed and down
 * when expanded. Empty sections follow the same convention because they still
 * disclose the "all read" panel.
 *
 * @param isVisible - Whether the section is currently expanded/visible.
 * @param type - The type of section (`'account'` or `'product'`).
 * @returns A `Chevron` object containing the icon direction and its accessible label.
 */
export function getChevronDetails(
  isVisible: boolean,
  type: 'account' | 'product',
): Chevron {
  let typeLocale: string;
  if (type === 'account') {
    typeLocale = i18n.t('common.account', { defaultValue: 'account' });
  } else {
    typeLocale = i18n.t('common.product', { defaultValue: 'product' });
  }

  return {
    icon: isVisible ? 'down' : 'right',
    label: isVisible
      ? i18n.t('chevron.hide', {
          defaultValue: 'Hide {{type}} notifications',
          type: typeLocale,
        })
      : i18n.t('chevron.show', {
          defaultValue: 'Show {{type}} notifications',
          type: typeLocale,
        }),
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
