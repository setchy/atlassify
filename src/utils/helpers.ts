import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { defaultSettings } from '../context/App';
import type { Link, SettingsState } from '../types';
import type { Notification } from './api/typesGitHub';

export async function generateGitHubWebUrl(
  notification: Notification,
): Promise<Link> {
  const url = new URL(notification.entity.url);

  return url.toString() as Link;
}

export function formatForDisplay(text: string[]): string {
  if (!text) {
    return '';
  }

  return text
    .join(' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase character followed by an uppercase character
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\w+/g, (word) => {
      // Convert to proper case (capitalize first letter of each word)
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

export function formatNotificationUpdatedAt(
  notification: Notification,
): string {
  try {
    return formatDistanceToNowStrict(parseISO(notification.updated_at), {
      addSuffix: true,
    });
  } catch (e) {}

  return '';
}

export function getFilterCount(settings: SettingsState): number {
  let count = 0;

  if (settings.filterReasons.length !== defaultSettings.filterReasons.length) {
    count += settings.filterReasons.length;
  }

  if (
    settings.detailedNotifications &&
    settings.hideBots !== defaultSettings.hideBots
  ) {
    count += 1;
  }

  return count;
}

export function getDirectoryPath(): string {
  return `${__dirname}`;
}
