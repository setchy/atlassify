import { formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';

import type { AtlassifyNotification } from '../../types';

import { getProductStrategy } from '../products';

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
 * Formats the footer text of a native notification based on its product type.
 * Appends the entity title to the footer text when present.
 *
 * @param notification - The notification to format native footer text for.
 * @returns The formatted native footer text string.
 */
export function formatNativeNotificationFooterText(
  notification: AtlassifyNotification,
): string {
  let footer = getProductStrategy(notification).footerText(notification);

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
