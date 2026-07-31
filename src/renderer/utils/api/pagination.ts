import { AxiosError } from 'axios';

import { Constants } from '../../constants';

import type { Account } from '../../types';

import { Errors } from '../core/errors';
import { getNotificationsForUser } from './client';
import type { AtlassianNotificationFragment } from './graphql/generated/graphql';

export interface NotificationFeedResult {
  nodes: AtlassianNotificationFragment[];
  unseenNotificationCount: number;
  hasMoreNotifications: boolean;
}

/**
 * Fetch every page of notifications for an account.
 *
 * The Atlassian GraphQL API limits each request to `Constants.NOTIFICATIONS_PAGE_SIZE`
 * notifications, so pages are fetched sequentially using the `after` cursor until either
 * a partial page is returned or `Constants.MAX_NOTIFICATIONS_PER_ACCOUNT` notifications
 * have been collected.
 *
 * The API's `pageInfo.hasNextPage` always returns `true`, even on the last page, so a page
 * returning fewer than `Constants.NOTIFICATIONS_PAGE_SIZE` nodes is treated as the end of the feed.
 *
 * @param account - The account to fetch notifications for.
 * @returns The combined notification nodes across all fetched pages, along with whether more notifications remain.
 */
export async function fetchAccountNotificationFeed(
  account: Account,
): Promise<NotificationFeedResult> {
  const nodes: AtlassianNotificationFragment[] = [];
  let unseenNotificationCount = 0;
  let after: string | undefined;
  let isFullPage: boolean;

  do {
    const res = await getNotificationsForUser(account, after);

    if (res.errors) {
      throw new AxiosError(Errors.BAD_REQUEST.title);
    }

    const feed = res.data.notifications.notificationFeed;
    unseenNotificationCount = res.data.notifications.unseenNotificationCount;
    nodes.push(...(feed.nodes ?? []));

    isFullPage = feed.nodes?.length === Constants.NOTIFICATIONS_PAGE_SIZE;
    after = feed.pageInfo?.endCursor;
  } while (
    isFullPage &&
    nodes.length < Constants.MAX_NOTIFICATIONS_PER_ACCOUNT
  );

  return {
    nodes,
    unseenNotificationCount,
    hasMoreNotifications: isFullPage,
  };
}
