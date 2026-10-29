import { Constants } from '../../constants';

import { useAccountsStore } from '../../stores';

import type {
  Account,
  AccountNotifications,
  AtlassifyNotification,
} from '../../types';

import { determineFailureType } from '../api/errors';
import { fetchAccountNotificationFeed } from '../api/pagination';
import { transformNotifications } from '../api/transform';
import { rendererLogError } from '../core/logger';
import { getFlattenedNotificationsByProduct } from './group';

/**
 * Get the count of notifications across all accounts.
 *
 * @param accountNotifications - The account notifications to check.
 * @returns The total count of all notifications across all accounts.
 */
export function getNotificationCount(
  accountNotifications: AccountNotifications[],
) {
  return accountNotifications.reduce(
    (sum, account) => sum + account.notifications.length,
    0,
  );
}

/**
 * Check if any accounts have more notifications beyond the max page size fetched per account.
 *
 * @param accountNotifications - The account notifications to check.
 * @returns `true` if any account has more notifications available to load, `false` otherwise.
 */
export function hasMoreNotifications(
  accountNotifications: AccountNotifications[],
) {
  return accountNotifications?.some((account) => account.hasMoreNotifications);
}

function getNotifications() {
  const accounts = useAccountsStore.getState().accounts;
  return accounts.map((account) => {
    return {
      account,
      notifications: fetchAccountNotificationFeed(account),
    };
  });
}

/**
 * Get all notifications for all accounts.
 *
 * Notifications follow these stages:
 *  - Fetch / retrieval
 *  - Transform
 *  - Filtering
 *  - Ordering
 *
 * @returns A promise that resolves to an array of account notifications.
 */
export async function getAllNotifications(): Promise<AccountNotifications[]> {
  const accountNotifications: AccountNotifications[] = await Promise.all(
    getNotifications()
      .filter((response) => !!response)
      .map(async (accountNotifications) => {
        try {
          const res = await accountNotifications.notifications;

          const notifications = await transformNotifications(
            res.nodes,
            accountNotifications.account,
          );

          return {
            account: accountNotifications.account,
            notifications: notifications,
            hasMoreNotifications: res.hasMoreNotifications,
            error: null,
          };
        } catch (err) {
          rendererLogError(
            'getAllNotifications',
            'error occurred while fetching account notifications',
            err,
          );

          return {
            account: accountNotifications.account,
            notifications: [],
            hasMoreNotifications: false,
            error: determineFailureType(err),
          };
        }
      }),
  );

  // Set the order property for the notifications
  stabilizeNotificationsOrder(accountNotifications);

  return accountNotifications;
}

/**
 * Assign an order property to each notification to stabilize how they are displayed
 * during notification interaction events (mark as read, mark as done, etc.).
 *
 * @param accountNotifications - The list of account notifications to assign order indices to.
 */
export function stabilizeNotificationsOrder(
  accountNotifications: AccountNotifications[],
) {
  let orderIndex = 0;

  for (const account of accountNotifications) {
    const flattenedNotifications = getFlattenedNotificationsByProduct(
      account.notifications,
    );

    for (const notification of flattenedNotifications) {
      notification.order = orderIndex++;
    }
  }
}

/**
 * Find notifications that exist in newNotifications but not in previousNotifications.
 *
 * @param previousAccountNotifications - The previous state of account notifications.
 * @param newAccountNotifications - The new state of account notifications.
 * @returns Array of notifications that are new (present in new state but absent in previous state).
 */
export function getNewNotifications(
  previousAccountNotifications: AccountNotifications[],
  newAccountNotifications: AccountNotifications[],
): AtlassifyNotification[] {
  return newAccountNotifications.flatMap((accountNotifications) => {
    const accountPreviousNotifications = previousAccountNotifications.find(
      (item) => item.account.id === accountNotifications.account.id,
    );

    if (!accountPreviousNotifications) {
      return accountNotifications.notifications;
    }

    const previousIds = new Set(
      accountPreviousNotifications.notifications.map((item) => item.id),
    );

    return accountNotifications.notifications.filter(
      (notification) => !previousIds.has(notification.id),
    );
  });
}

/**
 * Per-account timestamps of when a notification was first missing from the feed,
 * keyed by account ID and notification ID.
 */
export type TransientNotificationMisses = Map<string, Map<string, number>>;

/**
 * Confirms whether a notification that vanished from the feed is still unread.
 */
export type VerifyNotificationStillUnread = (
  account: Account,
  notification: AtlassifyNotification,
) => Promise<boolean>;

/**
 * Determine whether a notification should be retained while its unread state
 * could not be verified.
 */
function shouldRetainUnverifiedMiss(
  notification: AtlassifyNotification,
  misses: Map<string, number>,
  now: number,
  graceMs: number,
): boolean {
  const missedSince = misses.get(notification.id);

  if (missedSince === undefined) {
    misses.set(notification.id, now);
    return true;
  }

  if (now - missedSince < graceMs) {
    return true;
  }

  misses.delete(notification.id);
  return false;
}

/**
 * Absorb intermittent omissions from the Atlassian notification feed.
 *
 * The API occasionally drops a notification (notably Confluence comment groups)
 * from an otherwise complete response. Removing it immediately makes the inbox
 * and badge count flap, and re-adding it on the next fetch looks like a new
 * notification, which raises a native alert.
 *
 * Before retaining a missing notification, its unread state is verified with the
 * API. This keeps the inbox fresh: a notification read on the Atlassian side is
 * still removed on the next fetch. Only notifications that are confirmed unread,
 * or whose state could not be verified within the grace period, are retained.
 *
 * Reconciliation starts from the current query cache, so locally removed
 * notifications are not resurrected. A grouped row is not retained when another
 * notification in the same group is present, avoiding duplicates when a group's
 * head changes.
 *
 * @param previousAccountNotifications - The notifications currently in the cache.
 * @param newAccountNotifications - The latest feed result.
 * @param transientNotificationMisses - Mutable first-miss timestamps for unverified omissions.
 * @param verifyStillUnread - Confirms whether a missing notification is still unread.
 * @param now - Current timestamp, used to age out unverified omissions.
 * @param graceMs - How long an unverified omission may be retained.
 * @param maxVerifications - Maximum number of omissions to verify per fetch.
 * @returns The latest notifications with confirmed transient omissions retained.
 */
export async function reconcileMissingNotifications(
  previousAccountNotifications: AccountNotifications[] | undefined,
  newAccountNotifications: AccountNotifications[],
  transientNotificationMisses: TransientNotificationMisses,
  verifyStillUnread: VerifyNotificationStillUnread,
  now = Date.now(),
  graceMs = Constants.NOTIFICATION_TRANSIENT_MISS_GRACE_MS,
  maxVerifications = Constants.MAX_TRANSIENT_NOTIFICATION_VERIFICATIONS,
): Promise<AccountNotifications[]> {
  const previousByAccountId = new Map(
    (previousAccountNotifications ?? []).map((accountNotifications) => [
      accountNotifications.account.id,
      accountNotifications,
    ]),
  );

  const currentAccountIds = new Set(
    newAccountNotifications.map(
      (accountNotifications) => accountNotifications.account.id,
    ),
  );

  for (const accountId of transientNotificationMisses.keys()) {
    if (!currentAccountIds.has(accountId)) {
      transientNotificationMisses.delete(accountId);
    }
  }

  let retainedAny = false;
  const reconciled: AccountNotifications[] = [];

  for (const accountNotifications of newAccountNotifications) {
    const accountId = accountNotifications.account.id;
    const previous = previousByAccountId.get(accountId);

    // A failed fetch says nothing about which notifications still exist.
    if (!previous || accountNotifications.error !== null) {
      if (accountNotifications.error !== null) {
        transientNotificationMisses.delete(accountId);
      }
      reconciled.push(accountNotifications);
      continue;
    }

    const misses =
      transientNotificationMisses.get(accountId) ?? new Map<string, number>();

    const currentNotificationIds = new Set(
      accountNotifications.notifications.map((notification) => notification.id),
    );
    const currentGroupIds = new Set(
      accountNotifications.notifications
        .map((notification) => notification.notificationGroup?.id)
        .filter((groupId): groupId is string => !!groupId),
    );

    for (const notificationId of currentNotificationIds) {
      misses.delete(notificationId);
    }

    const missing = previous.notifications.filter((notification) => {
      if (currentNotificationIds.has(notification.id)) {
        return false;
      }

      const group = notification.notificationGroup;

      // The group is still represented, but by a different head notification.
      if (group?.size > 1 && group.id && currentGroupIds.has(group.id)) {
        misses.delete(notification.id);
        return false;
      }

      return true;
    });

    const retained: AtlassifyNotification[] = [];

    if (missing.length > 0 && missing.length <= maxVerifications) {
      const verifications = await Promise.allSettled(
        missing.map((notification) =>
          verifyStillUnread(accountNotifications.account, notification),
        ),
      );

      verifications.forEach((verification, index) => {
        const notification = missing[index];

        if (verification.status === 'fulfilled') {
          misses.delete(notification.id);

          if (verification.value) {
            retained.push(notification);
          }

          return;
        }

        // Verification failed (for example a transient network error), so keep
        // the last known notification until the grace period expires.
        if (shouldRetainUnverifiedMiss(notification, misses, now, graceMs)) {
          retained.push(notification);
        }
      });
    } else {
      // Too many notifications disappeared at once to verify individually
      // (for example a bulk read). Trust the feed and remove them immediately.
      for (const notification of missing) {
        misses.delete(notification.id);
      }
    }

    if (misses.size > 0) {
      transientNotificationMisses.set(accountId, misses);
    } else {
      transientNotificationMisses.delete(accountId);
    }

    if (retained.length === 0) {
      reconciled.push(accountNotifications);
      continue;
    }

    retainedAny = true;
    reconciled.push({
      ...accountNotifications,
      notifications: [...accountNotifications.notifications, ...retained],
    });
  }

  if (retainedAny) {
    stabilizeNotificationsOrder(reconciled);
  }

  return reconciled;
}
