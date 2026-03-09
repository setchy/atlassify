import { APPLICATION } from '../../../shared/constants';

import type { AtlassifyNotification } from '../../types';

import i18n from '../../i18n';
import { formatNativeNotificationFooterText } from '../notifications/formatters';

/**
 * Raises a native OS notification.
 *
 * For a single notification, the message is used as the title (non-Windows) and the
 * formatted footer text is used as the body. For multiple notifications, a generic count
 * summary is shown instead.
 *
 * @param notifications - The notifications to surface as a native OS notification.
 */
export const raiseNativeNotification = (
  notifications: AtlassifyNotification[],
) => {
  let title: string;
  let body: string;
  let url: string = null;

  if (notifications.length === 1) {
    const notification = notifications[0];
    title = window.atlassify.platform.isWindows() ? '' : notification.message;
    body = formatNativeNotificationFooterText(notification);
    url = notification.entity.url;
  } else {
    title = APPLICATION.NAME;
    body = i18n.t('notifications.native_count', {
      count: notifications.length,
    });
  }

  return window.atlassify.raiseNativeNotification(title, body, url);
};
