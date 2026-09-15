import type { QueryKey } from '@tanstack/react-query';

import type {
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
} from '../../types';

import { determineFailureType } from '../api/errors';

export interface NotificationActionBatch {
  notifications: AtlassifyNotification[];
  execute: () => Promise<unknown>;
}

export interface FailedNotificationAction {
  notification: AtlassifyNotification;
  error: AtlassifyError;
  rawError: Error;
}

export interface SettledNotificationActions {
  succeeded: AtlassifyNotification[];
  failed: FailedNotificationAction[];
}

export type NotificationQuerySnapshot = [
  QueryKey,
  AccountNotifications[] | undefined,
][];

export async function settleNotificationActionBatches(
  batches: NotificationActionBatch[],
): Promise<SettledNotificationActions> {
  const results = await Promise.allSettled(
    batches.map((batch) => batch.execute()),
  );
  const succeeded: AtlassifyNotification[] = [];
  const failed: FailedNotificationAction[] = [];

  results.forEach((result, index) => {
    const batch = batches[index];
    if (result.status === 'fulfilled') {
      succeeded.push(...batch.notifications);
      return;
    }

    const rawError =
      result.reason instanceof Error
        ? result.reason
        : new Error(String(result.reason));
    const error = determineFailureType(rawError);
    failed.push(
      ...batch.notifications.map((notification) => ({
        notification,
        error,
        rawError,
      })),
    );
  });

  return { succeeded, failed };
}

export function restoreFailedNotifications(
  failedNotifications: AtlassifyNotification[],
  snapshot: AccountNotifications[],
  current: AccountNotifications[],
): AccountNotifications[] {
  const failedIdsByAccount = new Map<string, Set<string>>();
  for (const notification of failedNotifications) {
    const failedIds = failedIdsByAccount.get(notification.account.id);
    if (failedIds) {
      failedIds.add(notification.id);
    } else {
      failedIdsByAccount.set(
        notification.account.id,
        new Set([notification.id]),
      );
    }
  }

  return current.map((accountEntry) => {
    const failedIds = failedIdsByAccount.get(accountEntry.account.id);
    const snapshotEntry = snapshot.find(
      (entry) => entry.account.id === accountEntry.account.id,
    );
    if (!failedIds || !snapshotEntry) {
      return accountEntry;
    }

    const snapshotFailures = new Map(
      snapshotEntry.notifications
        .filter((notification) => failedIds.has(notification.id))
        .map((notification) => [notification.id, notification]),
    );
    const restoredIds = new Set<string>();
    const restoredNotifications = accountEntry.notifications.map(
      (notification) => {
        const original = snapshotFailures.get(notification.id);
        if (!original) {
          return notification;
        }

        restoredIds.add(notification.id);
        return original;
      },
    );

    for (const [notificationId, notification] of snapshotFailures) {
      if (!restoredIds.has(notificationId)) {
        restoredNotifications.push(notification);
      }
    }
    restoredNotifications.sort((left, right) => left.order - right.order);

    return {
      ...accountEntry,
      notifications: restoredNotifications,
    };
  });
}
