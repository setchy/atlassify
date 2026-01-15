import AutomationIcon from '@atlaskit/icon/core/automation';
import PersonIcon from '@atlaskit/icon/core/person';

import type {
  AccountNotifications,
  ActorType,
  AtlassifyNotification,
  SettingsState,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

import i18n from '../../../i18n';
import { isCompassScorecardNotification } from '../../helpers';

const ACTOR_DETAILS: Record<ActorType, FilterDetails> = {
  user: {
    name: i18n.t('filters.actors.user.title'),
    description: i18n.t('filters.actors.user.description'),
    icon: PersonIcon,
  },
  automation: {
    name: i18n.t('filters.actors.automation.title'),
    description: i18n.t('filters.actors.automation.description'),
    icon: AutomationIcon,
  },
};

export const actorFilter: Filter<ActorType> = {
  FILTER_TYPES: ACTOR_DETAILS,

  getTypeDetails(type: ActorType): FilterDetails {
    return this.FILTER_TYPES[type];
  },

  hasFilters(settings: SettingsState): boolean {
    return settings.filterActors.length > 0;
  },

  isFilterSet(settings: SettingsState, type: ActorType): boolean {
    return settings.filterActors.includes(type);
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

export function inferNotificationActor(
  notification: AtlassifyNotification,
): ActorType {
  if (!notification.actor.displayName) {
    return 'automation';
  }

  if (isCompassScorecardNotification(notification)) {
    return 'automation';
  }

  if (notification.product.type === 'rovo_dev') {
    return 'automation';
  }

  if (notification.actor.displayName?.startsWith('Automation for')) {
    return 'automation';
  }

  return 'user';
}
