import { AxiosError } from 'axios';

import { Constants } from '../../constants';

import type { Account, CloudID } from '../../types';

import { Errors } from '../core/errors';
import { getNotificationsForUser } from './client';
import type { AtlassianNotificationFragment } from './graphql/generated/graphql';

export interface NotificationFeedResult {
  nodes: AtlassianNotificationFragment[];
  unseenNotificationCount: number;
  hasMoreNotifications: boolean;
}

/**
 * Fetch every page of notifications for a single site scope.
 *
 * The Atlassian GraphQL API limits each request to `Constants.NOTIFICATIONS_PAGE_SIZE`
 * notifications, so pages are fetched sequentially using the `after` cursor until either
 * the feed is exhausted or `Constants.MAX_NOTIFICATIONS_PER_ACCOUNT` notifications
 * have been collected.
 *
 * The API can return a page with fewer than `Constants.NOTIFICATIONS_PAGE_SIZE` nodes while
 * more pages still exist (for example 99 nodes followed by another page), and its
 * `pageInfo.hasNextPage` always returns `true`, even on the last page. A page is therefore
 * only treated as the end of the feed when it returns no nodes, no cursor, a cursor that
 * does not advance, or when the account cap is reached. Treating a short page as the end
 * truncates the inbox and makes its count fluctuate between refreshes.
 *
 * @param account - The account to fetch notifications for.
 * @param cloudId - When provided, scopes the fetch to that site; otherwise fetches the account's default, unscoped feed.
 * @returns The combined notification nodes across all fetched pages, along with whether more notifications remain.
 */
async function fetchNotificationFeedForScope(
  account: Account,
  cloudId?: CloudID,
): Promise<NotificationFeedResult> {
  const nodes: AtlassianNotificationFragment[] = [];
  let unseenNotificationCount = 0;
  let hasMoreNotifications = false;

  // Track cursors to guarantee pagination always makes progress and cannot loop.
  const seenCursors = new Set<string>();

  // Fetch pages sequentially: each request needs the `after` cursor from the
  // previous page, so recursion keeps the await out of a loop.
  async function fetchPage(after: string | undefined): Promise<void> {
    const res = await getNotificationsForUser(account, after, cloudId);

    if (res.errors) {
      throw new AxiosError(Errors.BAD_REQUEST.title);
    }

    const feed = res.data.notifications.notificationFeed;
    unseenNotificationCount = res.data.notifications.unseenNotificationCount;

    const pageNodes = feed.nodes ?? [];
    nodes.push(...pageNodes);

    const nextCursor = feed.pageInfo?.endCursor ?? undefined;
    const reachedAccountCap =
      nodes.length >= Constants.MAX_NOTIFICATIONS_PER_ACCOUNT;

    // Stop when a page is empty, a cursor is missing or has not advanced, or the
    // account cap is reached. A short page alone is not a reliable end marker.
    const shouldFetchMore =
      pageNodes.length > 0 &&
      !reachedAccountCap &&
      nextCursor !== undefined &&
      nextCursor !== after &&
      !seenCursors.has(nextCursor);

    hasMoreNotifications = reachedAccountCap && pageNodes.length > 0;

    if (shouldFetchMore) {
      seenCursors.add(nextCursor);
      await fetchPage(nextCursor);
    }
  }

  await fetchPage(undefined);

  return {
    nodes,
    unseenNotificationCount,
    hasMoreNotifications,
  };
}

/**
 * Fetch every page of notifications for an account.
 *
 * When the account has one or more hostname hints resolved to a Cloud ID, one scoped request
 * (per Cloud ID) is issued in parallel and the results are merged: de-duplicated by
 * notification ID, sorted by timestamp descending, with unseen counts summed. When the account
 * has no resolved hints, a single unscoped request is made, identical to prior behavior.
 *
 * @param account - The account to fetch notifications for.
 * @returns The combined notification nodes across all sites/pages, along with whether more notifications remain.
 */
export async function fetchAccountNotificationFeed(
  account: Account,
): Promise<NotificationFeedResult> {
  const cloudIds = (account.hostnameHints ?? [])
    .map((hint) => hint.cloudId)
    .filter((cloudId): cloudId is CloudID => cloudId !== null);

  const scopes = cloudIds.length > 0 ? cloudIds : [undefined];

  const results = await Promise.all(
    scopes.map((cloudId) => fetchNotificationFeedForScope(account, cloudId)),
  );

  if (results.length === 1) {
    return results[0];
  }

  const nodesById = new Map<string, AtlassianNotificationFragment>();
  for (const result of results) {
    for (const node of result.nodes) {
      nodesById.set(node.headNotification.notificationId, node);
    }
  }

  const nodes = Array.from(nodesById.values()).sort(
    (a, b) =>
      new Date(b.headNotification.timestamp).getTime() -
      new Date(a.headNotification.timestamp).getTime(),
  );

  return {
    nodes,
    unseenNotificationCount: results.reduce(
      (sum, result) => sum + result.unseenNotificationCount,
      0,
    ),
    hasMoreNotifications: results.some((result) => result.hasMoreNotifications),
  };
}
