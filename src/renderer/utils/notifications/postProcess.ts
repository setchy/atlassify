import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
} from '../../types';

import {
  removeNotificationsForAccount,
  shouldRemoveNotificationsFromState,
} from './remove';
import { updateNotificationsReadState } from './updateReadState';

export type NotificationActionType = 'read' | 'unread';

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
  if (shouldRemoveNotificationsFromState(actionType)) {
    return removeNotificationsForAccount(
      account,
      updatedAccountNotifications,
      affectedNotificationIds,
      actionType,
    );
  }

  // Otherwise, return the updated state
  return updatedAccountNotifications;
}
