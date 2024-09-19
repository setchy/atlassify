import type {
  AccountNotifications,
  AtlassifyNotification,
  AtlassifyState,
} from '../../types';
import { getAccountUUID } from '../auth/utils';
import { hideWindow, showWindow } from '../comms';
import { formatNotificationFooterText } from '../helpers';
import { openNotification } from '../links';
import { isWindows } from '../platform';
import { setTrayIconColor } from './notifications';

export const triggerNativeNotifications = (
  previousNotifications: AccountNotifications[],
  newNotifications: AccountNotifications[],
  state: AtlassifyState,
) => {
  const diffNotifications = newNotifications
    .map((accountNotifications) => {
      const accountPreviousNotifications = previousNotifications.find(
        (item) =>
          getAccountUUID(item.account) ===
          getAccountUUID(accountNotifications.account),
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
    raiseSoundNotification();
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

  if (notifications.length === 1) {
    const notification = notifications[0];
    title = isWindows() ? '' : notification.title;
    body = `${formatNotificationFooterText(notification)}: ${notification.entity.title}`;
  } else {
    title = 'Atlassify';
    body = `You have ${notifications.length} notifications.`;
  }

  const nativeNotification = new Notification(title, {
    body,
    silent: true,
  });

  nativeNotification.onclick = () => {
    if (notifications.length === 1) {
      hideWindow();
      openNotification(notifications[0]);
    } else {
      showWindow();
    }
  };

  return nativeNotification;
};

export const raiseSoundNotification = () => {
  const audio = new Audio('../../assets/sounds/notification.wav');
  audio.volume = 0.2;
  audio.play();
};
