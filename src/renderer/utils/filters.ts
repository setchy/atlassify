import EmojiFlagsIcon from '@atlaskit/icon/glyph/emoji/flags';
import WatchIcon from '@atlaskit/icon/glyph/watch';

import type {
  AccountNotifications,
  Category,
  FilterDetails,
  ProductName,
  ReadState,
  SettingsState,
} from '../types';

export const CATEGORIES: Record<Category, FilterDetails> = {
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

export function getCategoryDetails(category: Category): FilterDetails {
  return CATEGORIES[category];
}

export const READ_STATES: Record<ReadState, FilterDetails> = {
  unread: {
    name: 'unread',
    description: 'Unread notification',
  },
  read: {
    name: 'read',
    description: 'Read notification',
  },
};

export function getReadStateDetails(readState: ReadState): FilterDetails {
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
  product: ProductName,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo + acc.notifications.filter((n) => n.product.name === product).length,
    0,
  );
}

export function hasFiltersSet(settings: SettingsState): boolean {
  return (
    settings.filterCategories.length > 0 ||
    settings.filterReadStates.length > 0 ||
    settings.filterProducts.length > 0
  );
}
