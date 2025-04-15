import CommentIcon from '@atlaskit/icon/core/comment';
import MentionIcon from '@atlaskit/icon/core/mention';

import i18n from '../../../i18n';
import type {
  AccountNotifications,
  AtlassifyNotification,
  SettingsState,
  TimeSensitiveType,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

const TIME_SENSITIVE_DETAILS: Record<TimeSensitiveType, FilterDetails> = {
  mention: {
    name: 'mention',
    description: i18n.t('filters.time_sensitive.mention'),
    icon: MentionIcon,
  },
  comment: {
    name: 'comment',
    description: i18n.t('filters.time_sensitive.comment'),
    icon: CommentIcon,
  },
};

export const timeSensitiveFilter: Filter<TimeSensitiveType> = {
  FILTER_TYPES: TIME_SENSITIVE_DETAILS,

  getTypeDetails(type: TimeSensitiveType): FilterDetails {
    return this.FILTER_TYPES[type];
  },

  hasFilters(settings: SettingsState): boolean {
    return settings.filterTimeSensitive.length > 0;
  },

  isFilterSet(settings: SettingsState, type: TimeSensitiveType): boolean {
    return settings.filterTimeSensitive.includes(type);
  },

  getFilterCount(
    notifications: AccountNotifications[],
    timeSensitive: TimeSensitiveType,
  ) {
    return notifications.reduce(
      (memo, acc) =>
        memo +
        acc.notifications.filter((n) =>
          this.filterNotification(n, timeSensitive),
        ).length,
      0,
    );
  },

  filterNotification(
    notification: AtlassifyNotification,
    timeSensitive: TimeSensitiveType,
  ): boolean {
    return inferNotificationSensitivity(notification) === timeSensitive;
  },
};

export function inferNotificationSensitivity(
  notification: AtlassifyNotification,
): TimeSensitiveType | null {
  if (notification.message.includes(' mentioned ')) {
    return 'mention';
  }

  if (notification.message.includes(' replied ')) {
    return 'comment';
  }

  return null;
}
