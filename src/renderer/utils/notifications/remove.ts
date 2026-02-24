import { useSettingsStore } from '../../stores';

import type { Account, AccountNotifications } from '../../types';

import type { NotificationActionType } from './postProcess';

/**
 * Determine if notifications should be removed from state or left in-place, based on action type.
 */
export function shouldRemoveNotificationsFromState(
  actionType: NotificationActionType,
): boolean {
  if (actionType === 'read') {
    const settings = useSettingsStore.getState();
    return (
      !settings.delayNotificationState && settings.fetchOnlyUnreadNotifications
    );
  }

  // For 'unread', do not remove from state
  return false;
}

/**
 * Remove notifications (if applicable) from the account notifications list.
 *
 * @param account The account to which the notifications belong.
 * @param accountNotifications Current state of account notifications
 * @param notificationIDsToRemove Set of notification IDs to remove
 * @param actionType The action performed: 'read' or 'unread'
 * @returns Updated account notifications state
 */
export function removeNotificationsForAccount(
  account: Account,
  accountNotifications: AccountNotifications[],
  notificationIDsToRemove: Set<string>,
  actionType: NotificationActionType = 'read',
): AccountNotifications[] {
  const shouldRemove = shouldRemoveNotificationsFromState(actionType);

  return accountNotifications.map((acct) => {
    if (account.id !== acct.account.id) {
      return acct;
    }

    return {
      ...acct,
      notifications: shouldRemove
        ? acct.notifications.filter(
            (notification) => !notificationIDsToRemove.has(notification.id),
          )
        : acct.notifications,
    };
  });
}
