import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';

import { formatDistanceToNowStrict, parseISO } from 'date-fns';

import type { AtlassifyNotification, Chevron } from '../types';

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

export function getChevronDetails(
  hasNotifications: boolean,
  isVisible: boolean,
  type: 'account' | 'product',
): Chevron {
  if (!hasNotifications) {
    return {
      icon: ChevronLeftIcon,
      label: `No notifications for ${type}`,
    };
  }

  if (isVisible) {
    return {
      icon: ChevronDownIcon,
      label: `Hide ${type} notifications`,
    };
  }

  return {
    icon: ChevronRightIcon,
    label: `Show ${type} notifications`,
  };
}
