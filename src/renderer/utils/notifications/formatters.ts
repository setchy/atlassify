import { formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';

import type { AtlassifyNotification } from '../../types';

/**
 * Formats a string to proper case (capitalizes the first letter of each word).
 */
export function formatProperCase(text: string) {
  if (!text) {
    return '';
  }

  return text.replace(/\w+/g, (word) => {
    // Convert to proper case (capitalize first letter of each word)
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

/**
 * Formats the body text of a notification based on its product type.
 */
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

/**
 * Formats the footer text of a notification based on its product type.
 */
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

/**
 * Formats the footer text of a native notification based on its product type.
 */
export function formatNativeNotificationFooterText(
  notification: AtlassifyNotification,
): string {
  let footer = formatNotificationFooterText(notification);

  if (notification.entity.title) {
    footer += `: ${notification.entity.title}`;
  }

  return footer;
}

/**
 * Formats the updated_at timestamp of a notification to a human-readable string.
 */
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

/**
 * Extracts the repository name from a Bitbucket notification's entity URL.
 */
export function extractRepositoryName(
  notification: AtlassifyNotification,
): string {
  return notification.entity.url.split('/').slice(3, 5).join('/');
}

/**
 * Extracts the context name from a Rovo Dev notification's URL.
 */
export function extractRovoDevContextName(
  notification: AtlassifyNotification,
): string {
  const context = new URL(notification.url).pathname.split('/').pop();

  return `The AI coding tool has generated code for ${context}`;
}

/**
 * Extracts the goal or project key from a notification's path URL if it matches the expected pattern.
 */
export function extractGoalOrProjectKey(
  notification: AtlassifyNotification,
): string | null {
  const match = notification.path.url.match(/\/(goal|project)\/([^/]+)\/about/);
  return match ? match[2] : null;
}
