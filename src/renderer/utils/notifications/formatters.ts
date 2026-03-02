import { formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';

import type { AtlassifyNotification } from '../../types';

import {
  extractGoalOrProjectKey,
  extractRepositoryName,
  extractRovoDevContextName,
} from '../helpers';

export function formatProperCase(text: string) {
  if (!text) {
    return '';
  }

  return text.replace(/\w+/g, (word) => {
    // Convert to proper case (capitalize first letter of each word)
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}
export function formatNotificationBodyText(
  notification: AtlassifyNotification,
): string {
  switch (notification.product.type) {
    case 'rovo_dev':
      return extractRovoDevContextName(notification);
    default:
      return notification.entity.title;
  }
}

export function formatNotificationFooterText(
  notification: AtlassifyNotification,
): string {
  switch (notification.product.type) {
    case 'bitbucket':
      return extractRepositoryName(notification);
    case 'home': {
      const key = extractGoalOrProjectKey(notification);

      if (key) {
        return `${key}${notification.path.title}`
          .replace('Atlassian Home', '')
          .replace('Goals', '');
      }

      break;
    }
    default:
      break;
  }

  if (notification.path) {
    return notification.path.title;
  }

  return notification.product.display;
}
export function formatNotificationUpdatedAt(
  notification: AtlassifyNotification,
): string {
  const iso = notification.updated_at;

  if (!iso) {
    return '';
  }

  const parsed = parseISO(iso);
  if (!isValid(parsed)) {
    return '';
  }

  return formatDistanceToNowStrict(parsed, { addSuffix: true });
}
export function formatNativeNotificationFooterText(
  notification: AtlassifyNotification,
): string {
  let footer = formatNotificationFooterText(notification);

  if (notification.entity.title) {
    footer += `: ${notification.entity.title}`;
  }

  return footer;
}
