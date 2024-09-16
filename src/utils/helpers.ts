import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { defaultSettings } from '../context/App';
import type { AtlasifyNotification, SettingsState } from '../types';

export function formatProperCase(text: string) {
  return text.replace(/\w+/g, (word) => {
    // Convert to proper case (capitalize first letter of each word)
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export function getRepositoryName(notification: AtlasifyNotification): string {
  return notification.entity.url.split('/').slice(3, 5).join('/');
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
