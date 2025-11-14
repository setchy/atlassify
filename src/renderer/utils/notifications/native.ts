import { APPLICATION } from '../../../shared/constants';

import i18n from '../../i18n';
import type { AtlassifyNotification } from '../../types';
import { formatNativeNotificationFooterText } from '../helpers';

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

export const raiseSoundNotification = async (volume: number) => {
  const path = await window.atlassify.notificationSoundPath();

  const audio = new Audio(path);
  audio.volume = volume;
  audio.play();
};
