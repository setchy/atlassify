import AutomationIcon from '@atlaskit/icon/core/automation';
import PersonIcon from '@atlaskit/icon/core/person';

import type {
  AccountNotifications,
  ActorType,
  AtlassifyNotification,
  SettingsState,
} from '../../../types';
import type { FilterDetails } from './types';

export const FILTERS_ACTORS: Record<ActorType, FilterDetails> = {
  user: {
    name: 'user',
    description: 'User',
    icon: PersonIcon,
  },
  automation: {
    name: 'automation',
    description: 'Automation',
    icon: AutomationIcon,
  },
};

export function getActorFilterDetails(actor: ActorType): FilterDetails {
  return FILTERS_ACTORS[actor];
}

export function hasActorFilters(settings: SettingsState) {
  return settings.filterActors.length > 0;
}

export function isActorFilterSet(settings: SettingsState, actor: ActorType) {
  return settings.filterActors.includes(actor);
}

export function getActorFilterCount(
  notifications: AccountNotifications[],
  actor: ActorType,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo +
      acc.notifications.filter((n) => filterNotificationByActor(n, actor))
        .length,
    0,
  );
}

export function filterNotificationByActor(
  notification: AtlassifyNotification,
  actor,
): boolean {
  return inferNotificationActor(notification) === actor;
}

export function inferNotificationActor(
  notification: AtlassifyNotification,
): ActorType {
  return notification.actor.displayName.startsWith('Automation for')
    ? 'automation'
    : 'user';
}
