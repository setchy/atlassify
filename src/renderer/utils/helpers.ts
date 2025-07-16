import ChevronDownIcon from '@atlaskit/icon/utility/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/utility/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/utility/chevron-right';

import { formatDistanceToNowStrict, parseISO } from 'date-fns';

import i18n from '../i18n';
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

export function formatNativeNotificationFooterText(
  notification: AtlassifyNotification,
): string {
  let footer = formatNotificationFooterText(notification);

  if (notification.entity.title) {
    footer += `: ${notification.entity.title}`;
  }

  return footer;
}

export function formatNotificationUpdatedAt(
  notification: AtlassifyNotification,
): string {
  try {
    return formatDistanceToNowStrict(parseISO(notification.updated_at), {
      addSuffix: true,
    });
  } catch (_e) {}

  return '';
}

export function getChevronDetails(
  hasNotifications: boolean,
  isVisible: boolean,
  type: 'account' | 'product',
): Chevron {
  let typeLocale: string;
  if (type === 'account') {
    typeLocale = i18n.t('common.account');
  } else if (type === 'product') {
    typeLocale = i18n.t('common.product');
  }

  if (!hasNotifications) {
    return {
      icon: ChevronLeftIcon,
      label: i18n.t('chevron.none', { type: typeLocale }),
    };
  }

  if (isVisible) {
    return {
      icon: ChevronDownIcon,
      label: i18n.t('chevron.hide', { type: typeLocale }),
    };
  }

  return {
    icon: ChevronRightIcon,
    label: i18n.t('chevron.show', { type: typeLocale }),
  };
}
