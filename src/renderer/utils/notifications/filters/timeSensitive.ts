import CommentIcon from '@atlaskit/icon/glyph/comment';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';

import type {
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
  TimeSensitiveType,
} from '../../../types';
import type { FilterDetails } from './types';

export const FILTERS_TIME_SENSITIVE: Record<TimeSensitiveType, FilterDetails> =
  {
    mention: {
      name: 'mention',
      description: 'Mentions',
      icon: MentionIcon,
    },
    comment: {
      name: 'comment',
      description: 'Comments',
      icon: CommentIcon,
    },
  };

export function getTimeSensitiveFilterDetails(
  timeSensitive: TimeSensitiveType,
): FilterDetails {
  return FILTERS_TIME_SENSITIVE[timeSensitive];
}

export function hasTimeSensitiveFilters(settings: SettingsState) {
  return settings.filterTimeSensitive.length > 0;
}

export function isTimeSensitiveFilterSet(
  settings: SettingsState,
  timeSensitive: TimeSensitiveType,
) {
  return settings.filterTimeSensitive.includes(timeSensitive);
}

export function getTimeSensitiveFilterCount(
  notifications: AccountNotifications[],
  timeSensitive: TimeSensitiveType,
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
  timeSensitive: TimeSensitiveType,
): boolean {
  return inferNotificationSensitivity(notification) === timeSensitive;
}

export function inferNotificationSensitivity(
  notification: AtlassifyNotification,
): TimeSensitiveType | null {
  if (notification.message.includes(' mentioned ')) {
    return 'mention';
  }

  if (notification.message.includes(' replied ')) {
    return 'comment';
  }
}
