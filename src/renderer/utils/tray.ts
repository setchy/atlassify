import { onlineManager } from '@tanstack/react-query';

import { useSettingsStore } from '../stores';

import { updateTrayColor, updateTrayTitle } from './comms';

/**
 * Sets the tray icon color and title based on the number of unread notifications.
 *
 * @param unreadNotifications - The number of unread notifications
 * @param hasMoreNotifications - Whether there are more notifications beyond the unread count
 */
export function setTrayIconColorAndTitle(
  unreadNotifications: number,
  hasMoreNotifications: boolean,
) {
  const settings = useSettingsStore.getState();
  const {
    showNotificationsCountInTray,
    useUnreadActiveIcon,
    useAlternateIdleIcon,
  } = settings;

  const isOnline = onlineManager.isOnline();

  let title = '';
  if (isOnline && showNotificationsCountInTray && unreadNotifications > 0) {
    title = `${unreadNotifications.toString()}${hasMoreNotifications ? '+' : ''}`;
  }

  updateTrayColor(
    unreadNotifications,
    useUnreadActiveIcon,
    useAlternateIdleIcon,
  );
  updateTrayTitle(title);
}
