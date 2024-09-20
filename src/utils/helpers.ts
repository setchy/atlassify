import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import type { AtlassifyNotification } from '../types';

export function formatProperCase(text: string) {
  return text.replace(/\w+/g, (word) => {
    // Convert to proper case (capitalize first letter of each word)
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export function getRepositoryName(notification: AtlassifyNotification): string {
  return notification.entity.url.split('/').slice(3, 5).join('/');
}

export function formatNotificationFooterText(
  notification: AtlassifyNotification,
): string {
  if (notification.path) {
    return notification.path.title;
  }

  switch (notification.product.name) {
    case 'bitbucket':
      return getRepositoryName(notification);
    default:
      return formatProperCase(notification.product.name);
  }
}

export function formatNotificationUpdatedAt(
  notification: AtlassifyNotification,
): string {
  try {
    return formatDistanceToNowStrict(parseISO(notification.updated_at), {
      addSuffix: true,
    });
  } catch (e) {}

  return '';
}

/* istanbul ignore next */
export function getDirectoryPath(): string {
  return `${__dirname}`;
}
