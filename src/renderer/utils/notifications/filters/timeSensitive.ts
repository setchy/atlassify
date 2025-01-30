import CommentIcon from '@atlaskit/icon/glyph/comment';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';

import type {
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
  TimeSensitiveFilterType,
} from '../../../types';
import type { FilterDetails } from './types';

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

export function hasTimeSensitiveFilters(settings: SettingsState) {
  return settings.filterTimeSensitive.length > 0;
}

export function isTimeSensitiveFilterSet(
  settings: SettingsState,
  timeSensitive: TimeSensitiveFilterType,
) {
  return settings.filterTimeSensitive.includes(timeSensitive);
}

export function getTimeSensitiveFilterCount(
  notifications: AccountNotifications[],
  timeSensitive: TimeSensitiveFilterType,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo +
      acc.notifications.filter((n) =>
        filterNotificationByTimeSensitive(n, timeSensitive),
      ).length,
    0,
  );
}

export function filterNotificationByTimeSensitive(
  notification: AtlassifyNotification,
  timeSensitive: TimeSensitiveFilterType,
): boolean {
  const timeSensitiveDetails = getTimeSensitiveFilterDetails(timeSensitive);

  return notification.message.includes(timeSensitiveDetails.contains);
}
