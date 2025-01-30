import AutomationIcon from '@atlaskit/icon/core/automation';
import PersonIcon from '@atlaskit/icon/core/person';
import type {
  AccountNotifications,
  AtlassifyNotification,
  AuthorFilterType,
  SettingsState,
} from '../../../types';
import type { FilterDetails } from './types';

export const FILTERS_AUTHORS: Record<AuthorFilterType, FilterDetails> = {
  user: {
    name: 'user',
    description: 'User',
    doesNotStartWith: 'Automation for',
    icon: PersonIcon,
  },
  automation: {
    name: 'automation',
    description: 'Automation',
    startsWith: 'Automation for',
    icon: AutomationIcon,
  },
};

export function getAuthorFilterDetails(
  author: AuthorFilterType,
): FilterDetails {
  return FILTERS_AUTHORS[author];
}

export function hasAuthorFilters(settings: SettingsState) {
  return settings.filterAuthors.length > 0;
}

export function isAuthorFilterSet(
  settings: SettingsState,
  author: AuthorFilterType,
) {
  return settings.filterAuthors.includes(author);
}

export function getAuthorFilterCount(
  notifications: AccountNotifications[],
  author: AuthorFilterType,
) {
  return notifications.reduce(
    (memo, acc) =>
      memo +
      acc.notifications.filter((n) => {
        filterNotificationByAuthor(n, author);
      }).length,
    0,
  );
}

export function filterNotificationByAuthor(
  notification: AtlassifyNotification,
  author: AuthorFilterType,
): boolean {
  const authorDetails = getAuthorFilterDetails(author);

  console.log('message ', notification.message);

  return notification.message.startsWith('Automation for');
}
