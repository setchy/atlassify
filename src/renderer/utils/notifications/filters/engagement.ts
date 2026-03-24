import CommentIcon from '@atlaskit/icon/core/comment';
import EmojiIcon from '@atlaskit/icon/core/emoji';
import MentionIcon from '@atlaskit/icon/core/mention';
import MoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';

import { useFiltersStore } from '../../../stores';

import type {
  AccountNotifications,
  AtlassifyNotification,
  EngagementStateType,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

import i18n from '../../../i18n';
import { getProductStrategy } from '../../products';

/**
 * Filter implementation for the notification engagement state (mention, comment, reaction, other).
 */
export const engagementFilter: Filter<EngagementStateType> = {
  get FILTER_TYPES(): Record<EngagementStateType, FilterDetails> {
    return {
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
      other: {
        name: i18n.t('filters.engagement.other.title'),
        description: i18n.t('filters.engagement.other.description'),
        icon: MoreHorizontalIcon,
      },
    };
  },

  getTypeDetails(type: EngagementStateType): FilterDetails {
    return this.FILTER_TYPES[type];
  },

  hasFilters(): boolean {
    const filters = useFiltersStore.getState();
    return filters.engagementStates.length > 0;
  },

  isFilterSet(type: EngagementStateType): boolean {
    const filters = useFiltersStore.getState();
    return filters.engagementStates.includes(type);
  },

  getFilterCount(
    accountNotifications: AccountNotifications[],
    engagementState: EngagementStateType,
  ) {
    return accountNotifications.reduce(
      (memo, account) =>
        memo +
        account.notifications.filter((notification) =>
          this.filterNotification(notification, engagementState),
        ).length,
      0,
    );
  },

  filterNotification(
    notification: AtlassifyNotification,
    engagementState: EngagementStateType,
  ): boolean {
    const strategy = getProductStrategy(notification);
    return strategy.engagementState(notification) === engagementState;
  },
};
