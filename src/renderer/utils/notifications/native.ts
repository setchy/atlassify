import { APPLICATION } from '../../../shared/constants';

import i18n from '../../i18n';
import type {
  AccountNotifications,
  AtlassifyNotification,
  AtlassifyState,
} from '../../types';
import { formatNativeNotificationFooterText } from '../helpers';
import { setTrayIconColor } from './notifications';

export const triggerNativeNotifications = (
  previousNotifications: AccountNotifications[],
  newNotifications: AccountNotifications[],
  state: AtlassifyState,
) => {
  const diffNotifications = newNotifications
    .map((accountNotifications) => {
      const accountPreviousNotifications = previousNotifications.find(
        (item) => item.account.id === accountNotifications.account.id,
      );

      if (!accountPreviousNotifications) {
        return accountNotifications.notifications;
      }

      const accountPreviousNotificationsIds =
        accountPreviousNotifications.notifications.map((item) => item.id);

      const accountNewNotifications = accountNotifications.notifications.filter(
        (item) => {
          return !accountPreviousNotificationsIds.includes(`${item.id}`);
        },
      );

      return accountNewNotifications;
    })
    .reduce((acc, val) => acc.concat(val), []);

  setTrayIconColor(newNotifications);

  // If there are no new notifications just stop there
  if (!diffNotifications.length) {
    return;
  }

  if (state.settings.playSoundNewNotifications) {
    raiseSoundNotification(state.settings.notificationVolume / 100);
  }

  if (state.settings.showSystemNotifications) {
    raiseNativeNotification(diffNotifications);
  }
};

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
