import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';

import { Constants } from '../../constants';

import type { AtlassianGraphQLResponse } from './types';

import * as client from './client';
import type {
  AtlassianNotificationFragment,
  MyNotificationsQuery,
} from './graphql/generated/graphql';
import { fetchAccountNotificationFeed } from './pagination';

function createMockNode(groupId: string): AtlassianNotificationFragment {
  return {
    groupId,
    groupSize: 1,
    additionalActors: [],
    headNotification: null,
  } as unknown as AtlassianNotificationFragment;
}

function createMockPage(
  nodes: AtlassianNotificationFragment[],
  endCursor: string | null,
  unseenNotificationCount = 0,
): AtlassianGraphQLResponse<MyNotificationsQuery> {
  return {
    data: {
      notifications: {
        unseenNotificationCount,
        notificationFeed: {
          pageInfo: { hasNextPage: true, endCursor },
          nodes,
        },
      },
    },
  } as unknown as AtlassianGraphQLResponse<MyNotificationsQuery>;
}

describe('renderer/utils/api/pagination.ts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return all nodes and stop when a partial page is returned', async () => {
    const fullPage = Array.from(
      { length: Constants.NOTIFICATIONS_PAGE_SIZE },
      (_, i) => createMockNode(`full-${i}`),
    );
    const partialPage = [createMockNode('partial-0')];

    vi.spyOn(client, 'getNotificationsForUser')
      .mockResolvedValueOnce(createMockPage(fullPage, 'cursor-1', 5))
      .mockResolvedValueOnce(createMockPage(partialPage, null, 5));

    const result = await fetchAccountNotificationFeed(
      mockAtlassianCloudAccount,
    );

    expect(client.getNotificationsForUser).toHaveBeenCalledTimes(2);
    expect(client.getNotificationsForUser).toHaveBeenNthCalledWith(
      2,
      mockAtlassianCloudAccount,
      'cursor-1',
      undefined,
    );
    expect(result.nodes).toHaveLength(Constants.NOTIFICATIONS_PAGE_SIZE + 1);
    expect(result.unseenNotificationCount).toBe(5);
    expect(result.hasMoreNotifications).toBe(false);
  });

  it('should stop paginating once the account cap is reached', async () => {
    const pageCount = Math.ceil(
      Constants.MAX_NOTIFICATIONS_PER_ACCOUNT /
        Constants.NOTIFICATIONS_PAGE_SIZE,
    );
    const fullPage = Array.from(
      { length: Constants.NOTIFICATIONS_PAGE_SIZE },
      (_, i) => createMockNode(`node-${i}`),
    );

    const spy = vi.spyOn(client, 'getNotificationsForUser');
    for (let i = 0; i < pageCount; i++) {
      spy.mockResolvedValueOnce(createMockPage(fullPage, `cursor-${i}`));
    }

    const result = await fetchAccountNotificationFeed(
      mockAtlassianCloudAccount,
    );

    expect(client.getNotificationsForUser).toHaveBeenCalledTimes(pageCount);
    expect(result.hasMoreNotifications).toBe(true);
  });

  it('should throw when the GraphQL response contains errors', async () => {
    vi.spyOn(client, 'getNotificationsForUser').mockResolvedValueOnce({
      errors: [{ message: 'Something went wrong' }],
    } as unknown as AtlassianGraphQLResponse<MyNotificationsQuery>);

    await expect(
      fetchAccountNotificationFeed(mockAtlassianCloudAccount),
    ).rejects.toThrow();
  });

  it('should handle a response missing pageInfo/nodes gracefully', async () => {
    vi.spyOn(client, 'getNotificationsForUser').mockResolvedValueOnce({
      data: {
        notifications: {
          unseenNotificationCount: 0,
          notificationFeed: {},
        },
      },
    } as unknown as AtlassianGraphQLResponse<MyNotificationsQuery>);

    const result = await fetchAccountNotificationFeed(
      mockAtlassianCloudAccount,
    );

    expect(result.nodes).toEqual([]);
    expect(result.hasMoreNotifications).toBe(false);
  });

  describe('with hostname hints resolved to Cloud IDs', () => {
    function createMockNodeWithId(
      notificationId: string,
      timestamp: string,
    ): AtlassianNotificationFragment {
      return {
        groupId: notificationId,
        groupSize: 1,
        additionalActors: [],
        headNotification: { notificationId, timestamp },
      } as unknown as AtlassianNotificationFragment;
    }

    const accountWithHints = {
      ...mockAtlassianCloudAccount,
      hostnameHints: [
        { hostname: 'site-a.atlassian.net', cloudId: 'cloud-a' },
        { hostname: 'site-b.atlassian.net', cloudId: 'cloud-b' },
      ],
    } as typeof mockAtlassianCloudAccount;

    it('fetches one scoped request per resolved Cloud ID and merges results', async () => {
      vi.spyOn(client, 'getNotificationsForUser').mockImplementation(
        async (_account, _after, cloudId) => {
          if (cloudId === 'cloud-a') {
            return createMockPage(
              [createMockNodeWithId('shared', '2026-07-01T00:00:00.000Z')],
              null,
              1,
            );
          }
          return createMockPage(
            [
              createMockNodeWithId('shared', '2026-07-01T00:00:00.000Z'),
              createMockNodeWithId('newer', '2026-07-02T00:00:00.000Z'),
            ],
            null,
            2,
          );
        },
      );

      const result = await fetchAccountNotificationFeed(accountWithHints);

      expect(client.getNotificationsForUser).toHaveBeenCalledTimes(2);
      expect(client.getNotificationsForUser).toHaveBeenCalledWith(
        accountWithHints,
        undefined,
        'cloud-a',
      );
      expect(client.getNotificationsForUser).toHaveBeenCalledWith(
        accountWithHints,
        undefined,
        'cloud-b',
      );
      // de-duplicated by notificationId, sorted newest first
      expect(
        result.nodes.map((n) => n.headNotification.notificationId),
      ).toEqual(['newer', 'shared']);
      expect(result.unseenNotificationCount).toBe(3);
    });

    it('falls back to a single unscoped request when no hint has a resolved Cloud ID', async () => {
      const accountWithUnresolvedHint = {
        ...mockAtlassianCloudAccount,
        hostnameHints: [{ hostname: 'site-a.atlassian.net', cloudId: null }],
      } as typeof mockAtlassianCloudAccount;

      vi.spyOn(client, 'getNotificationsForUser').mockResolvedValueOnce(
        createMockPage([createMockNode('n1')], null, 0),
      );

      await fetchAccountNotificationFeed(accountWithUnresolvedHint);

      expect(client.getNotificationsForUser).toHaveBeenCalledTimes(1);
      expect(client.getNotificationsForUser).toHaveBeenCalledWith(
        accountWithUnresolvedHint,
        undefined,
        undefined,
      );
    });
  });
});
