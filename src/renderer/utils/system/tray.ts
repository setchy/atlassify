import type {
  TrayAppState,
  TrayIdleIconType,
  TrayUnreadIconStyle,
} from '../../../shared/events';

import { useRuntimeStore, useSettingsStore } from '../../stores';

import { updateTrayColor, updateTrayTitle } from './comms';

/**
 * Updates the tray icon and title using the current notification status,
 * online status, and settings store values.
 *
 * Notification status (count, hasMore, isError) is read from useRuntimeStore,
 * which is kept up-to-date by useNotifications with already-filtered values.
 * This avoids re-applying filter logic against the raw query cache.
 *
 * Designed to be called any time the tray needs to reflect current state,
 * whether triggered by a notification fetch, a settings change, or an online/offline event.
 */
export function setTrayIconColorAndTitle() {
  const { notificationCount, hasMoreAccountNotifications, isError, isOnline } =
    useRuntimeStore.getState();
  const {
    showNotificationsCountInTray,
    useUnreadActiveIcon,
    useAlternateIdleIcon,
  } = useSettingsStore.getState();

  let title = '';
  if (
    isOnline &&
    showNotificationsCountInTray &&
    !isError &&
    notificationCount > 0
  ) {
    title = `${notificationCount.toString()}${hasMoreAccountNotifications ? '+' : ''}`;
  }

  const appState: TrayAppState = isError
    ? 'error'
    : isOnline
      ? 'online'
      : 'offline';

  const idleIconType: TrayIdleIconType = useAlternateIdleIcon
    ? 'alternative'
    : 'default';

  const unreadIconStyle: TrayUnreadIconStyle = useUnreadActiveIcon
    ? 'active'
    : 'idle';

  updateTrayColor(notificationCount, appState, idleIconType, unreadIconStyle);
  updateTrayTitle(title);
}
