import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';

import * as productsModule from '../products';
import { PRODUCTS } from '../products';
import type { AtlassianNotificationFragment } from './graphql/generated/graphql';
import {
  InfluentsNotificationCategory,
  InfluentsNotificationReadState,
} from './graphql/generated/graphql';
import { transformNotifications } from './transform';

const mockRawNotification: AtlassianNotificationFragment = {
  groupId: 'group-1',
  groupSize: 1,
  additionalActors: [],
  headNotification: {
    notificationId: 'notif-1',
    timestamp: '2024-01-01T00:00:00.000Z',
    readState: InfluentsNotificationReadState.Unread,
    category: InfluentsNotificationCategory.Direct,
    content: {
      type: 'comment',
      message: 'Test notification message',
      url: 'https://example.atlassian.net/browse/TEST-1',
      entity: {
        title: 'TEST-1 Summary',
        iconUrl: 'https://example.atlassian.net/favicon.ico',
        url: 'https://example.atlassian.net/browse/TEST-1',
      },
      path: null,
      actor: {
        displayName: 'Test User',
        avatarURL: 'https://example.com/avatar.png',
      },
    },
    analyticsAttributes: [{ key: 'registrationProduct', value: 'jira' }],
  },
};

describe('renderer/utils/api/transform.ts', () => {
  let inferAtlassianProductSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    inferAtlassianProductSpy = vi
      .spyOn(productsModule, 'inferAtlassianProduct')
      .mockResolvedValue(PRODUCTS.jira);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('transformNotifications', () => {
    it('returns empty array when given no notifications', async () => {
      const result = await transformNotifications(
        [],
        mockAtlassianCloudAccount,
      );

      expect(result).toEqual([]);
    });

    it('transforms a single notification correctly', async () => {
      const result = await transformNotifications(
        [mockRawNotification],
        mockAtlassianCloudAccount,
      );

      expect(result).toHaveLength(1);

      const notification = result[0];
      expect(notification.id).toBe('notif-1');
      expect(notification.message).toBe('Test notification message');
      expect(notification.readState).toBe('unread');
      expect(notification.updated_at).toBe('2024-01-01T00:00:00.000Z');
      expect(notification.type).toBe('comment');
      expect(notification.url).toBe(
        'https://example.atlassian.net/browse/TEST-1',
      );
      expect(notification.category).toBe('direct');
      expect(notification.product).toBe(PRODUCTS.jira);
      expect(notification.account).toBe(mockAtlassianCloudAccount);
      expect(notification.order).toBe(0);
    });

    it('maps entity fields correctly', async () => {
      const result = await transformNotifications(
        [mockRawNotification],
        mockAtlassianCloudAccount,
      );

      expect(result[0].entity).toEqual({
        title: 'TEST-1 Summary',
        iconUrl: 'https://example.atlassian.net/favicon.ico',
        url: 'https://example.atlassian.net/browse/TEST-1',
      });
    });

    it('maps actor fields correctly', async () => {
      const result = await transformNotifications(
        [mockRawNotification],
        mockAtlassianCloudAccount,
      );

      expect(result[0].actor).toEqual({
        displayName: 'Test User',
        avatarURL: 'https://example.com/avatar.png',
      });
    });

    it('maps notificationGroup fields correctly', async () => {
      const result = await transformNotifications(
        [mockRawNotification],
        mockAtlassianCloudAccount,
      );

      expect(result[0].notificationGroup).toEqual({
        id: 'group-1',
        size: 1,
        additionalActors: [],
      });
    });

    it('maps additional actors correctly', async () => {
      const rawWithActors: AtlassianNotificationFragment = {
        ...mockRawNotification,
        groupSize: 3,
        additionalActors: [
          { displayName: 'Actor One', avatarURL: 'https://example.com/a1.png' },
          { displayName: 'Actor Two', avatarURL: 'https://example.com/a2.png' },
        ],
      };

      const result = await transformNotifications(
        [rawWithActors],
        mockAtlassianCloudAccount,
      );

      expect(result[0].notificationGroup.additionalActors).toEqual([
        { displayName: 'Actor One', avatarURL: 'https://example.com/a1.png' },
        { displayName: 'Actor Two', avatarURL: 'https://example.com/a2.png' },
      ]);
    });

    it('maps path when present', async () => {
      const rawWithPath: AtlassianNotificationFragment = {
        ...mockRawNotification,
        headNotification: {
          ...mockRawNotification.headNotification,
          content: {
            ...mockRawNotification.headNotification.content,
            path: [
              {
                title: 'My Space',
                iconUrl: 'https://example.atlassian.net/space-icon.svg',
                url: 'https://example.atlassian.net/wiki/spaces/MY',
              },
            ],
          },
        },
      };

      const result = await transformNotifications(
        [rawWithPath],
        mockAtlassianCloudAccount,
      );

      expect(result[0].path).toEqual({
        title: 'My Space',
        iconUrl: 'https://example.atlassian.net/space-icon.svg',
        url: 'https://example.atlassian.net/wiki/spaces/MY',
      });
    });

    it('sets path to undefined when path is null', async () => {
      const result = await transformNotifications(
        [mockRawNotification],
        mockAtlassianCloudAccount,
      );

      expect(result[0].path).toBeUndefined();
    });

    it('transforms multiple notifications and calls inferAtlassianProduct for each', async () => {
      inferAtlassianProductSpy
        .mockResolvedValueOnce(PRODUCTS.jira)
        .mockResolvedValueOnce(PRODUCTS.confluence);

      const secondRaw: AtlassianNotificationFragment = {
        ...mockRawNotification,
        headNotification: {
          ...mockRawNotification.headNotification,
          notificationId: 'notif-2',
        },
      };

      const result = await transformNotifications(
        [mockRawNotification, secondRaw],
        mockAtlassianCloudAccount,
      );

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('notif-1');
      expect(result[0].product).toBe(PRODUCTS.jira);
      expect(result[1].id).toBe('notif-2');
      expect(result[1].product).toBe(PRODUCTS.confluence);
      expect(inferAtlassianProductSpy).toHaveBeenCalledTimes(2);
    });

    it('sets order to 0 for all notifications (stabilized later)', async () => {
      const secondRaw: AtlassianNotificationFragment = {
        ...mockRawNotification,
        headNotification: {
          ...mockRawNotification.headNotification,
          notificationId: 'notif-2',
        },
      };

      const result = await transformNotifications(
        [mockRawNotification, secondRaw],
        mockAtlassianCloudAccount,
      );

      expect(result[0].order).toBe(0);
      expect(result[1].order).toBe(0);
    });

    it('passes the account to inferAtlassianProduct', async () => {
      await transformNotifications(
        [mockRawNotification],
        mockAtlassianCloudAccount,
      );

      expect(inferAtlassianProductSpy).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
        mockRawNotification.headNotification,
      );
    });
  });
});
