import useSettingsStore from '../stores/useSettingsStore';

import { updateTrayColor, updateTrayTitle } from './comms';

/**
 * Sets the tray icon color and title based on the number of unread notifications.
 *
 * @param unreadNotifications - The number of unread notifications
 */
export function setTrayIconColorAndTitle(
  unreadNotifications: number,
  hasMoreNotifications: boolean,
) {
  const settings = useSettingsStore.getState();
  let title = '';
  if (settings.showNotificationsCountInTray && unreadNotifications > 0) {
    title = `${unreadNotifications.toString()}${hasMoreNotifications ? '+' : ''}`;
  }

  updateTrayColor(unreadNotifications);
  updateTrayTitle(title);
}
