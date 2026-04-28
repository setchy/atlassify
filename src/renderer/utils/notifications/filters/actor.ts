import AutomationIcon from '@atlaskit/icon/core/automation';
import PersonIcon from '@atlaskit/icon/core/person';
import RovoIcon from '@atlaskit/icon-lab/core/rovo';

import { useFiltersStore } from '../../../stores';

import type {
  AccountNotifications,
  ActorType,
  AtlassifyNotification,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

import i18n from '../../../i18n';
import { getProductStrategy } from '../../products';

/**
 * Filter implementation for the notification actor type (user vs automation).
 */
export const actorFilter: Filter<ActorType> = {
  get FILTER_TYPES(): Record<ActorType, FilterDetails> {
    return {
      user: {
        name: i18n.t('filters.actors.user.title'),
        description: i18n.t('filters.actors.user.description'),
        icon: PersonIcon,
      },
      rovo: {
        name: i18n.t('filters.actors.rovo.title'),
        description: i18n.t('filters.actors.rovo.description'),
        icon: RovoIcon,
      },
      automation: {
        name: i18n.t('filters.actors.automation.title'),
        description: i18n.t('filters.actors.automation.description'),
        icon: AutomationIcon,
      },
    };
  },

  getTypeDetails(type: ActorType): FilterDetails {
    return this.FILTER_TYPES[type];
  },

  hasFilters(): boolean {
    const filters = useFiltersStore.getState();
    return filters.actors.length > 0;
  },

  isFilterSet(type: ActorType): boolean {
    const filters = useFiltersStore.getState();
    return filters.actors.includes(type);
  },

  getFilterCount(
    accountNotifications: AccountNotifications[],
    actor: ActorType,
  ) {
    return accountNotifications.reduce(
      (memo, account) =>
        memo +
        account.notifications.filter((notification) =>
          this.filterNotification(notification, actor),
        ).length,
      0,
    );
  },

  filterNotification(
    notification: AtlassifyNotification,
    actor: ActorType,
  ): boolean {
    return inferNotificationActor(notification) === actor;
  },
};

/**
 * Infers whether a notification was triggered by a human user, rovo product suite or an automated actor.
 *
 * @param notification - The notification to inspect.
 * @returns actor type based on notification heuristics
 */
export function inferNotificationActor(
  notification: AtlassifyNotification,
): ActorType {
  if (!notification.actor.displayName) {
    return 'automation';
  }

  if (notification.actor.displayName?.startsWith('Automation for')) {
    return 'automation';
  }

  return getProductStrategy(notification).actorType(notification);
}
