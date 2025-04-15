import AutomationIcon from '@atlaskit/icon/core/automation';
import PersonIcon from '@atlaskit/icon/core/person';

import i18n from '../../../i18n';
import type {
  AccountNotifications,
  ActorType,
  AtlassifyNotification,
  SettingsState,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

const ACTOR_DETAILS: Record<ActorType, FilterDetails> = {
  user: {
    name: 'user',
    description: i18n.t('filters.actors.user'),
    icon: PersonIcon,
  },
  automation: {
    name: 'automation',
    description: i18n.t('filters.actors.automation'),
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

  getFilterCount(notifications: AccountNotifications[], actor: ActorType) {
    return notifications.reduce(
      (memo, acc) =>
        memo +
        acc.notifications.filter((n) => this.filterNotification(n, actor))
          .length,
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
  return notification.actor.displayName.startsWith('Automation for')
    ? 'automation'
    : 'user';
}
