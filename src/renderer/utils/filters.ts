import CommentIcon from '@atlaskit/icon/glyph/comment';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import FlagsIcon from '@atlaskit/icon/glyph/emoji/flags';
import WatchIcon from '@atlaskit/icon/glyph/watch';

import type {
  AccountNotifications,
  CategoryFilterType,
  FilterDetails,
  ProductName,
  ReadStateFilterType,
  SettingsState,
  TimeSensitiveFilterType,
} from '../types';

export const FILTERS_TIME_SENSITIVE: Record<
  TimeSensitiveFilterType,
  FilterDetails
> = {
  mention: {
    name: 'mention',
    description: 'Mentions',
    contains: ' mentioned ',
    icon: MentionIcon,
  },
  comment: {
    name: 'comment',
    description: 'Comments',
    contains: ' replied ',
    icon: CommentIcon,
  },
};

export function getTimeSensitiveFilterDetails(
  timeSensitive: TimeSensitiveFilterType,
): FilterDetails {
  return FILTERS_TIME_SENSITIVE[timeSensitive];
}

export function getTimeSensitiveFilterCount(
  notifications: AccountNotifications[],
  filterDetails: FilterDetails,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo +
      acc.notifications.filter((n) =>
        n.message.includes(filterDetails.contains),
      ).length,
    0,
  );
}

export const FILTERS_CATEGORIES: Record<CategoryFilterType, FilterDetails> = {
  direct: {
    name: 'direct',
    description: 'Direct notification',
    icon: FlagsIcon,
  },
  watching: {
    name: 'watching',
    description: 'Watching notification',
    icon: WatchIcon,
  },
};

export function getCategoryFilterDetails(
  category: CategoryFilterType,
): FilterDetails {
  return FILTERS_CATEGORIES[category];
}

export function getCategoryFilterCount(
  notifications: AccountNotifications[],
  category: CategoryFilterType,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo + acc.notifications.filter((n) => n.category === category).length,
    0,
  );
}

export const FILTERS_READ_STATES: Record<ReadStateFilterType, FilterDetails> = {
  unread: {
    name: 'unread',
    description: 'Unread notification',
  },
  read: {
    name: 'read',
    description: 'Read notification',
  },
};

export function getReadStateFilterDetails(
  readState: ReadStateFilterType,
): FilterDetails {
  return FILTERS_READ_STATES[readState];
}

export function getReadStateFilterCount(
  notifications: AccountNotifications[],
  readState: ReadStateFilterType,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo + acc.notifications.filter((n) => n.readState === readState).length,
    0,
  );
}

export function isUnreadOnlyFilterSet(settings: SettingsState): boolean {
  return (
    settings.filterReadStates.length === 1 &&
    settings.filterReadStates.includes('unread')
  );
}

export function isReadOnlyFilterSet(settings: SettingsState): boolean {
  return (
    settings.filterReadStates.length === 1 &&
    settings.filterReadStates.includes('read')
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

export function hasAnyFiltersSet(settings: SettingsState): boolean {
  return (
    settings.filterTimeSensitive.length > 0 ||
    settings.filterCategories.length > 0 ||
    settings.filterReadStates.length > 0 ||
    settings.filterProducts.length > 0
  );
}
