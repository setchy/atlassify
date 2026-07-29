import type {
  TrayAppState,
  TrayIdleIconVariant,
  TrayUnreadIconVariant,
} from '../../../shared/events';

import { useRuntimeStore, useSettingsStore } from '../../stores';

import { updateTrayColor, updateTrayTitle } from './comms';

/**
 * Updates the tray icon and title using the current notification status,
 * online status, and settings store values.
 *
 * Notification status (count, hasMore, hasAnyAccountError) is read from useRuntimeStore,
 * which is kept up-to-date by useNotifications with already-filtered values.
 * This avoids re-applying filter logic against the raw query cache.
 *
 * Designed to be called any time the tray needs to reflect current state,
 * whether triggered by a notification fetch, a settings change, or an online/offline event.
 */
export function setTrayIconColorAndTitle() {
  const {
    notificationCount,
    hasMoreAccountNotifications,
    hasAnyAccountError,
    isOnline,
  } = useRuntimeStore.getState();
  const {
    showNotificationsCountInTray,
    useUnreadActiveIcon,
    useAlternateIdleIcon,
  } = useSettingsStore.getState();

  let title = '';
  if (
    isOnline &&
    !hasAnyAccountError &&
    notificationCount > 0 &&
    showNotificationsCountInTray
  ) {
    title = `${notificationCount.toString()}${hasMoreAccountNotifications ? '+' : ''}`;
  }

  const appState: TrayAppState = !isOnline
    ? 'offline'
    : hasAnyAccountError
      ? 'error'
      : 'online';

  const idleIconVariant: TrayIdleIconVariant = useAlternateIdleIcon
    ? 'alternative'
    : 'default';

  const unreadIconVariant: TrayUnreadIconVariant = useUnreadActiveIcon
    ? 'active'
    : 'idle';

  updateTrayColor(
    notificationCount,
    appState,
    idleIconVariant,
    unreadIconVariant,
  );
  updateTrayTitle(title);
}
