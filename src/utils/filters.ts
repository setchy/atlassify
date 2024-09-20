import EmojiFlagsIcon from '@atlaskit/icon/glyph/emoji/flags';
import WatchIcon from '@atlaskit/icon/glyph/watch';

import { defaultSettings } from '../context/App';
import type { AccountNotifications, SettingsState } from '../types';
import type { BasicDetails, Category, Product, ReadState } from './api/types';

export const CATEGORIES: Record<Category, BasicDetails> = {
  direct: {
    name: 'direct',
    description: 'Direct notification',
    icon: EmojiFlagsIcon,
  },
  watching: {
    name: 'watching',
    description: 'Watching notification',
    icon: WatchIcon,
  },
};

export function getCategoryDetails(category: Category): BasicDetails {
  return CATEGORIES[category];
}

export const READ_STATES: Record<ReadState, BasicDetails> = {
  unread: {
    name: 'unread',
    description: 'Unread notification',
  },
  read: {
    name: 'read',
    description: 'Read notification',
  },
};

export function getReadStateDetails(readState: ReadState): BasicDetails {
  return READ_STATES[readState];
}

export function getReadStateFilterCount(
  notifications: AccountNotifications[],
  readState: ReadState,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo + acc.notifications.filter((n) => n.readState === readState).length,
    0,
  );
}

export function getCategoryFilterCount(
  notifications: AccountNotifications[],
  category: Category,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo + acc.notifications.filter((n) => n.category === category).length,
    0,
  );
}

export function getProductFilterCount(
  notifications: AccountNotifications[],
  product: Product,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo + acc.notifications.filter((n) => n.product.name === product).length,
    0,
  );
}

// TODO: implementation is primitive.  Should be comparing a intersection of the filter arrays.  Perhaps only needs to be a hasFilters function, too.
export function getFilterCount(settings: SettingsState): number {
  let count = 0;

  if (
    settings.filterCategories.length !== defaultSettings.filterCategories.length
  ) {
    count += settings.filterCategories.length;
  }

  if (
    settings.filterReadStates.length !== defaultSettings.filterReadStates.length
  ) {
    count += settings.filterReadStates.length;
  }

  if (
    settings.filterProducts.length !== defaultSettings.filterProducts.length
  ) {
    count += settings.filterProducts.length;
  }

  return count;
}
