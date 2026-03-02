import { useSettingsStore } from '../../stores';

import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
} from '../../types';

export type NotificationActionType = 'read' | 'unread';

/**
 * Determine if notifications should be removed from state or left in-place.
 */
export function shouldRemoveNotificationsFromState(): boolean {
  const settings = useSettingsStore.getState();
  return (
    !settings.delayNotificationState && settings.fetchOnlyUnreadNotifications
  );
}

/**
 * Remove notifications (if applicable) from the account notifications list.
 *
 * @param account The account to which the notifications belong.
 * @param accountNotifications Current state of account notifications
 * @param notificationIDsToRemove Set of notification IDs to remove
 * @returns Updated account notifications state
 */
export function removeNotificationsForAccount(
  account: Account,
  accountNotifications: AccountNotifications[],
  notificationIDsToRemove: Set<string>,
): AccountNotifications[] {
  return accountNotifications.map((acct) => {
    if (account.id !== acct.account.id) {
      return acct;
    }

    return {
      ...acct,
      notifications: acct.notifications.filter(
        (notification) => !notificationIDsToRemove.has(notification.id),
      ),
    };
  });
}

/**
 * Returns a new array of notifications with the readState updated for the given IDs.
 *
 * @param account The account to which the notifications belong.
 * @param accountNotifications Current state of account notifications
 * @param notificationIDsToUpdate Set of notification IDs to update
 * @param readState The new read state to set
 * @returns Updated account notifications state
 */
export function updateNotificationsReadState(
  account: Account,
  accountNotifications: AccountNotifications[],
  notificationIDsToUpdate: Set<string>,
  readState: NotificationActionType,
): AccountNotifications[] {
  return accountNotifications.map((acct) => {
    if (account.id !== acct.account.id) {
      return acct;
    }

    return {
      ...acct,
      notifications: acct.notifications.map((notification) => {
        if (notificationIDsToUpdate.has(notification.id)) {
          return { ...notification, readState: readState };
        }

        return notification;
      }),
    };
  });
}

/**
 * Post-process notifications after marking as read or unread.
 * Updates readState immutably and removes from state if required.
 *
 * @param account The account to which the notifications belong.
 * @param accountNotifications The current state of account notifications.
 * @param affectedNotifications The notifications that were marked as read/unread.
 * @param actionType The action performed: 'read' or 'unread'.
 * @returns The updated account notifications state.
 */
export function postProcessNotifications(
  account: Account,
  accountNotifications: AccountNotifications[],
  affectedNotifications: AtlassifyNotification[],
  actionType: NotificationActionType,
): AccountNotifications[] {
  // Build a Set of affected notification IDs for fast lookup
  const affectedNotificationIds = new Set(
    affectedNotifications.map((n) => n.id),
  );

  // Immutably update readState for affected notifications in the account's notifications
  const updatedAccountNotifications = updateNotificationsReadState(
    account,
    accountNotifications,
    affectedNotificationIds,
    actionType,
  );

  // Decide if notifications should be removed from state
  if (actionType !== 'unread' && shouldRemoveNotificationsFromState()) {
    return removeNotificationsForAccount(
      account,
      updatedAccountNotifications,
      affectedNotificationIds,
    );
  }

  // Otherwise, return the updated state
  return updatedAccountNotifications;
}
