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

export const TIME_SENSITIVE_FILTERS: Record<
  TimeSensitiveFilterType,
  FilterDetails
> = {
  mention: {
    name: 'mention',
    description: 'Mentions',
    contains: 'mentioned you on a page',
    icon: MentionIcon,
  },
  comment: {
    name: 'comment',
    description: 'Comments',
    contains: 'replied to your comment',
    icon: CommentIcon,
  },
};

export function getTimeSensitiveFilterDetails(
  timeSensitive: TimeSensitiveFilterType,
): FilterDetails {
  return TIME_SENSITIVE_FILTERS[timeSensitive];
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

export const CATEGORIES_FILTERS: Record<CategoryFilterType, FilterDetails> = {
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
  return CATEGORIES_FILTERS[category];
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

export const READ_STATES_FILTERS: Record<ReadStateFilterType, FilterDetails> = {
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
  return READ_STATES_FILTERS[readState];
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

export function hasAnyTimeSensitiveFiltersSet(
  settings: SettingsState,
): boolean {
  return settings.filterTimeSensitive.length > 0;
}
