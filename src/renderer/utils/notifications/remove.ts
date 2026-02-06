import type { SettingsState } from '../../types';

/**
 * Determine if notifications should be removed from state or marked as read in-place.
 */
export function shouldRemoveNotificationsFromState(
  settings: SettingsState,
): boolean {
  return (
    !settings.delayNotificationState && settings.fetchOnlyUnreadNotifications
  );
}
