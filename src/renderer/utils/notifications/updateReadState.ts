import type { Account, AccountNotifications } from '../../types';

import type { NotificationActionType } from './postProcess';

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
