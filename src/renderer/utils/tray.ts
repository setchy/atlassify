import useSettingsStore from '../stores/useSettingsStore';

import { updateTrayColor, updateTrayTitle } from './comms';

/**
 * Sets the tray icon color and title based on the number of unread notifications.
 *
 * @param unreadNotifications - The number of unread notifications
 * @param hasMoreNotifications - Whether there are more notifications beyond the unread count
 * @param isOnline - Whether the application is currently online
 */
export function setTrayIconColorAndTitle(
  unreadNotifications: number,
  hasMoreNotifications: boolean,
  isOnline: boolean,
) {
  const settings = useSettingsStore.getState();
  let title = '';
  if (
    isOnline &&
    settings.showNotificationsCountInTray &&
    unreadNotifications > 0
  ) {
    title = `${unreadNotifications.toString()}${hasMoreNotifications ? '+' : ''}`;
  }

  updateTrayColor(unreadNotifications, isOnline);
  updateTrayTitle(title);
}
