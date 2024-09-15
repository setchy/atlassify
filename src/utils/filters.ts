import EmojiFlagsIcon from '@atlaskit/icon/glyph/emoji/flags';
import WatchIcon from '@atlaskit/icon/glyph/watch';

import type { BasicDetails, Category, ReadState } from './api/types';

export const CATEGORIES: Record<Category, BasicDetails> = {
  direct: {
    name: 'direct',
    description: 'Direct notifications',
    icon: EmojiFlagsIcon,
    iconProps: {
      size: 'small',
    },
  },
  watching: {
    name: 'watching',
    description: 'Watching notifications',
    icon: WatchIcon,
    iconProps: {
      size: 'small',
    },
  },
};

export function getCategoryDetails(category: Category): BasicDetails {
  return CATEGORIES[category];
}

export const READ_STATES: Record<ReadState, BasicDetails> = {
  unread: {
    name: 'unread',
    description: 'Unread notifications',
  },
  read: {
    name: 'read',
    description: 'Read notifications',
  },
};

export function getReadStateDetails(readState: ReadState): BasicDetails {
  return READ_STATES[readState];
}
