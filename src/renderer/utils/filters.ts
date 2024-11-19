import CommentIcon from '@atlaskit/icon/core/comment';
import EyeOpenIcon from '@atlaskit/icon/core/eye-open';
import FlagsIcon from '@atlaskit/icon/core/flag';
import MentionIcon from '@atlaskit/icon/core/mention';

import type {
  AccountNotifications,
  Category,
  FilterDetails,
  ProductName,
  ReadState,
  SettingsState,
  TimeSensitive,
} from '../types';

export const TIME_SENSITIVE: Record<TimeSensitive, FilterDetails> = {
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

export function getTimeSensitiveDetails(
  timeSensitive: TimeSensitive,
): FilterDetails {
  return TIME_SENSITIVE[timeSensitive];
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

export const CATEGORIES: Record<Category, FilterDetails> = {
  direct: {
    name: 'direct',
    description: 'Direct notification',
    icon: FlagsIcon,
  },
  watching: {
    name: 'watching',
    description: 'Watching notification',
    icon: EyeOpenIcon,
  },
};

export function getCategoryDetails(category: Category): FilterDetails {
  return CATEGORIES[category];
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
    settings.filterTimeSensitive.length > 0 ||
    settings.filterCategories.length > 0 ||
    settings.filterReadStates.length > 0 ||
    settings.filterProducts.length > 0
  );
}

export function hasTimeSensitiveFiltersSet(settings: SettingsState): boolean {
  return settings.filterTimeSensitive.length > 0;
}
