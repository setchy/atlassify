import CommentIcon from '@atlaskit/icon/core/comment';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import MentionIcon from '@atlaskit/icon/core/mention';

import i18n from '../../../i18n';
import type {
  AccountNotifications,
  AtlassifyNotification,
  EngagementStateType,
  SettingsState,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

const ENGAGEMENT_DETAILS: Record<EngagementStateType, FilterDetails> = {
  mention: {
    name: i18n.t('filters.engagement.mention.title'),
    description: i18n.t('filters.engagement.mention.description'),
    icon: MentionIcon,
  },
  comment: {
    name: i18n.t('filters.engagement.comment.title'),
    description: i18n.t('filters.engagement.comment.description'),
    icon: CommentIcon,
  },
  reaction: {
    name: i18n.t('filters.engagement.reactions.title'),
    description: i18n.t('filters.engagement.reactions.description'),
    icon: EmojiIcon,
  },
};

export const engagementFilter: Filter<EngagementStateType> = {
  FILTER_TYPES: ENGAGEMENT_DETAILS,

  getTypeDetails(type: EngagementStateType): FilterDetails {
    return this.FILTER_TYPES[type];
  },

  hasFilters(settings: SettingsState): boolean {
    return settings.filterEngagementStates.length > 0;
  },

  isFilterSet(settings: SettingsState, type: EngagementStateType): boolean {
    return settings.filterEngagementStates.includes(type);
  },

  getFilterCount(
    notifications: AccountNotifications[],
    engagementState: EngagementStateType,
  ) {
    return notifications.reduce(
      (memo, acc) =>
        memo +
        acc.notifications.filter((n) =>
          this.filterNotification(n, engagementState),
        ).length,
      0,
    );
  },

  filterNotification(
    notification: AtlassifyNotification,
    engagementState: EngagementStateType,
  ): boolean {
    return inferNotificationEngagementState(notification) === engagementState;
  },
};

export function inferNotificationEngagementState(
  notification: AtlassifyNotification,
): EngagementStateType | null {
  if (notification.message.includes(' mentioned ')) {
    return 'mention';
  }

  if (notification.message.includes(' replied ')) {
    return 'comment';
  }

  if (/ reacted.+to your /.exec(notification.message)) {
    return 'reaction';
  }

  return null;
}
