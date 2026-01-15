import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import type { AlignBlock } from '@atlaskit/primitives/dist/types/components/types';

import { formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';

import { Constants } from '../constants';

import type { AtlassifyNotification, Chevron } from '../types';

import i18n from '../i18n';

export function formatProperCase(text: string) {
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

export function extractRepositoryName(
  notification: AtlassifyNotification,
): string {
  return notification.entity.url.split('/').slice(3, 5).join('/');
}

export function extractRovoDevContextName(
  notification: AtlassifyNotification,
): string {
  const context = new URL(notification.url).pathname.split('/').pop();

  return `The AI coding tool has generated code for ${context}`;
}

function extractGoalOrProjectKey(
  notification: AtlassifyNotification,
): string | null {
  const match = notification.path.url.match(/\/(goal|project)\/([^/]+)\/about/);
  return match ? match[2] : null;
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

export function getChevronDetails(
  hasNotifications: boolean,
  isVisible: boolean,
  type: 'account' | 'product',
): Chevron {
  let typeLocale: string;
  if (type === 'account') {
    typeLocale = i18n.t('common.account');
  } else {
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

export function blockAlignmentByLength(text: string): AlignBlock {
  return text?.length > Constants.BLOCK_ALIGNMENT_LENGTH_THRESHOLD
    ? 'start'
    : 'center';
}

export function isCompassScorecardNotification(
  notification: AtlassifyNotification,
): boolean {
  return (
    notification.product.type === 'compass' &&
    notification.message.includes('a scorecard')
  );
}
