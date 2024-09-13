import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { defaultSettings } from '../context/App';
import type { Link, SettingsState } from '../types';
import type { AtlasifyNotification } from './api/typesGitHub';

export async function generateGitHubWebUrl(
  notification: AtlasifyNotification,
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
  notification: AtlasifyNotification,
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

  if (
    settings.filterCategories.length !== defaultSettings.filterCategories.length
  ) {
    count += settings.filterCategories.length;
  }

  if (
    settings.filterReadStates.length !== defaultSettings.filterReadStates.length
  ) {
    count += settings.filterReadStates.length;
  }

  if (
    settings.filterProducts.length !== defaultSettings.filterProducts.length
  ) {
    count += settings.filterProducts.length;
  }

  return count;
}

export function getDirectoryPath(): string {
  return `${__dirname}`;
}
