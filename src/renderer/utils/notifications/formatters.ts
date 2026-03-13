import { formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';

import type { AtlassifyNotification } from '../../types';

/**
 * Formats a string to proper case (capitalizes the first letter of each word).
 *
 * @param text - The string to format.
 * @returns The proper-cased string, or an empty string if the input is falsy.
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
 *
 * @param notification - The notification to format body text for.
 * @returns The formatted body text string.
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
 *
 * @param notification - The notification to format footer text for.
 * @returns The formatted footer text string.
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
 * Appends the entity title to the footer text when present.
 *
 * @param notification - The notification to format native footer text for.
 * @returns The formatted native footer text string.
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
 * Formats the `updated_at` timestamp of a notification to a human-readable relative time string.
 *
 * @param notification - The notification whose timestamp to format.
 * @returns A relative time string (e.g. `"2 hours ago"`), or an empty string if the date is absent or invalid.
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
 * Extracts the repository name (in `owner/repo` format) from a Bitbucket notification's entity URL.
 *
 * @param notification - The Bitbucket notification to extract the repository name from.
 * @returns The repository name in `owner/repo` format.
 */
export function extractRepositoryName(
  notification: AtlassifyNotification,
): string {
  return notification.entity.url.split('/').slice(3, 5).join('/');
}

/**
 * Extracts the Rovo Dev context name from a Rovo Dev notification's URL.
 *
 * @param notification - The Rovo Dev notification to extract the context name from.
 * @returns A human-readable string describing the AI coding context (e.g. `"The AI coding tool has generated code for my-branch"`).
 */
export function extractRovoDevContextName(
  notification: AtlassifyNotification,
): string {
  const context = new URL(notification.url).pathname.split('/').pop();

  return `The AI coding tool has generated code for ${context}`;
}

/**
 * Extracts the goal or project key from a notification's path URL if it matches the expected pattern.
 *
 * @param notification - The notification whose path URL to inspect.
 * @returns The key string (e.g. `"PROJ-123"`) if matched, or `null` if the URL does not contain a goal/project path.
 */
export function extractGoalOrProjectKey(
  notification: AtlassifyNotification,
): string | null {
  const match = notification.path.url.match(/\/(goal|project)\/([^/]+)\/about/);
  return match ? match[2] : null;
}

/**
 * Returns `true` if the notification is a Compass scorecard notification.
 * Used to apply special rendering for scorecard-related activity.
 *
 * @param notification - The notification to inspect.
 * @returns `true` if the notification is a Compass scorecard notification, `false` otherwise.
 */
export function isCompassScorecardNotification(
  notification: AtlassifyNotification,
): boolean {
  return (
    notification.product.type === 'compass' &&
    notification.message.includes('a scorecard')
  );
}
