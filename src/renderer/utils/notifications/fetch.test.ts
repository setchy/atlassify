import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import {
  createMockNotificationForProductType,
  mockSingleAccountNotifications,
} from '../../__mocks__/notifications-mocks';

import type { AccountNotifications, AtlassifyNotification } from '../../types';

import { Errors } from '../core/errors';
import {
  getNewNotifications,
  getNotificationCount,
  hasMoreNotifications,
  reconcileMissingNotifications,
  type TransientNotificationMisses,
} from './fetch';

describe('renderer/utils/notifications/fetch.ts', () => {
  it('getNotificationCount', () => {
    const result = getNotificationCount(mockSingleAccountNotifications);

    expect(result).toBe(1);
  });

  describe('hasMoreNotifications', () => {
    it('should return false if no additional pages available', () => {
      const result = hasMoreNotifications(mockSingleAccountNotifications);

      expect(result).toBe(false);
    });

    it('should return true if additional pages available', () => {
      mockSingleAccountNotifications[0].hasMoreNotifications = true;
      const result = hasMoreNotifications(mockSingleAccountNotifications);

      expect(result).toBe(true);
    });
  });

  describe('getNewNotifications', () => {
    it('returns all notifications when previous is empty', () => {
      const newAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [
            createMockNotificationForProductType('1', 'jira'),
            createMockNotificationForProductType('2', 'jira'),
            createMockNotificationForProductType('3', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications([], newAccountNotifications);

      expect(result).toHaveLength(3);
      expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
    });

    it('returns empty array when new is empty', () => {
      const previousAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [createMockNotificationForProductType('1', 'jira')],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications(previousAccountNotifications, []);

      expect(result).toHaveLength(0);
    });

    it('returns empty array when both are empty', () => {
      const result = getNewNotifications([], []);

      expect(result).toHaveLength(0);
    });

    it('returns only new notifications, filtering out existing ones', () => {
      const previousAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [
            createMockNotificationForProductType('1', 'jira'),
            createMockNotificationForProductType('2', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const newAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [
            createMockNotificationForProductType('2', 'jira'),
            createMockNotificationForProductType('3', 'jira'),
            createMockNotificationForProductType('4', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications(
        previousAccountNotifications,
        newAccountNotifications,
      );

      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toEqual(['3', '4']);
    });

    it('returns empty array when all notifications already exist', () => {
      const previousAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [
            createMockNotificationForProductType('1', 'jira'),
            createMockNotificationForProductType('2', 'jira'),
            createMockNotificationForProductType('3', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const newAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [
            createMockNotificationForProductType('1', 'jira'),
            createMockNotificationForProductType('2', 'jira'),
            createMockNotificationForProductType('3', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications(
        previousAccountNotifications,
        newAccountNotifications,
      );

      expect(result).toHaveLength(0);
    });

    it('handles multiple accounts correctly', () => {
      const mockAtlassianCloudAccountTwo = {
        ...mockAtlassianCloudAccount,
        id: 'account-2',
      };

      const previousAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [createMockNotificationForProductType('1', 'jira')],
          error: null,
          hasMoreNotifications: false,
        },
        {
          account: mockAtlassianCloudAccountTwo,
          notifications: [createMockNotificationForProductType('10', 'jira')],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const newAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [
            createMockNotificationForProductType('1', 'jira'),
            createMockNotificationForProductType('2', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
        {
          account: mockAtlassianCloudAccountTwo,
          notifications: [
            createMockNotificationForProductType('10', 'jira'),
            createMockNotificationForProductType('11', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications(
        previousAccountNotifications,
        newAccountNotifications,
      );

      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toEqual(['2', '11']);
    });

    it('treats new account as having all new notifications', () => {
      const mockAtlassianCloudAccountTwo = {
        ...mockAtlassianCloudAccount,
        id: 'account-2',
      };

      const previousAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [createMockNotificationForProductType('1', 'jira')],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const newAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [createMockNotificationForProductType('1', 'jira')],
          error: null,
          hasMoreNotifications: false,
        },
        {
          account: mockAtlassianCloudAccountTwo,
          notifications: [
            createMockNotificationForProductType('10', 'jira'),
            createMockNotificationForProductType('11', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications(
        previousAccountNotifications,
        newAccountNotifications,
      );

      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toEqual(['10', '11']);
    });

    it('handles account with no notifications', () => {
      const previousAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [createMockNotificationForProductType('1', 'jira')],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const newAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications(
        previousAccountNotifications,
        newAccountNotifications,
      );

      expect(result).toHaveLength(0);
    });

    it('preserves notification order from input', () => {
      const previousAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [createMockNotificationForProductType('1', 'jira')],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const newAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [
            createMockNotificationForProductType('5', 'jira'),
            createMockNotificationForProductType('3', 'jira'),
            createMockNotificationForProductType('4', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications(
        previousAccountNotifications,
        newAccountNotifications,
      );

      expect(result).toHaveLength(3);
      expect(result.map((n) => n.id)).toEqual(['5', '3', '4']);
    });

    it('handles removed account gracefully', () => {
      const mockAtlassianCloudAccountTwo = {
        ...mockAtlassianCloudAccount,
        id: 'account-2',
      };

      const previousAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [createMockNotificationForProductType('1', 'jira')],
          error: null,
          hasMoreNotifications: false,
        },
        {
          account: mockAtlassianCloudAccountTwo,
          notifications: [createMockNotificationForProductType('10', 'jira')],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const newAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [
            createMockNotificationForProductType('1', 'jira'),
            createMockNotificationForProductType('2', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications(
        previousAccountNotifications,
        newAccountNotifications,
      );

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('handles multiple new notifications across multiple accounts', () => {
      const mockAtlassianCloudAccountTwo = {
        ...mockAtlassianCloudAccount,
        id: 'account-2',
      };

      const previousAccountNotifications: AccountNotifications[] = [];

      const newAccountNotifications: AccountNotifications[] = [
        {
          account: mockAtlassianCloudAccount,
          notifications: [
            createMockNotificationForProductType('1', 'jira'),
            createMockNotificationForProductType('2', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
        {
          account: mockAtlassianCloudAccountTwo,
          notifications: [
            createMockNotificationForProductType('10', 'jira'),
            createMockNotificationForProductType('11', 'jira'),
          ],
          error: null,
          hasMoreNotifications: false,
        },
      ];

      const result = getNewNotifications(
        previousAccountNotifications,
        newAccountNotifications,
      );

      expect(result).toHaveLength(4);
      expect(result.map((n) => n.id)).toEqual(['1', '2', '10', '11']);
    });
  });

  describe('reconcileMissingNotifications', () => {
    function createNotification(
      id: string,
      groupId: string,
      groupSize: number,
    ): AtlassifyNotification {
      return {
        ...createMockNotificationForProductType(id, 'confluence'),
        notificationGroup: {
          id: groupId,
          size: groupSize,
          additionalActors: [],
        },
      };
    }

    function createAccountNotifications(
      notifications: AtlassifyNotification[],
      error: AccountNotifications['error'] = null,
    ): AccountNotifications[] {
      return [
        {
          account: mockAtlassianCloudAccount,
          notifications,
          error,
          hasMoreNotifications: false,
        },
      ];
    }

    it('retains a notification that the API confirms is still unread', async () => {
      const notificationA = createNotification('a', 'group-a', 2);
      const notificationB = createNotification('b', 'group-b', 1);
      const transientMisses: TransientNotificationMisses = new Map();
      const verifyStillUnread = vi.fn(async () => true);

      const result = await reconcileMissingNotifications(
        createAccountNotifications([notificationA, notificationB]),
        createAccountNotifications([notificationB]),
        transientMisses,
        verifyStillUnread,
        0,
        1000,
      );

      expect(result[0].notifications.map((n) => n.id).sort()).toEqual([
        'a',
        'b',
      ]);
      expect(verifyStillUnread).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
        notificationA,
      );
      expect(transientMisses.size).toBe(0);
    });

    it('removes a notification immediately when the API confirms it is no longer unread', async () => {
      const notificationA = createNotification('a', 'group-a', 2);
      const notificationB = createNotification('b', 'group-b', 1);
      const transientMisses: TransientNotificationMisses = new Map();
      const verifyStillUnread = vi.fn(async () => false);

      const result = await reconcileMissingNotifications(
        createAccountNotifications([notificationA, notificationB]),
        createAccountNotifications([notificationB]),
        transientMisses,
        verifyStillUnread,
        0,
        1000,
      );

      expect(result[0].notifications.map((n) => n.id)).toEqual(['b']);
      expect(transientMisses.size).toBe(0);
    });

    it('falls back to the grace period when verification fails', async () => {
      const notificationA = createNotification('a', 'group-a', 2);
      const notificationB = createNotification('b', 'group-b', 1);
      const transientMisses: TransientNotificationMisses = new Map();
      const verifyStillUnread = vi.fn(async () => {
        throw new Error('verification failed');
      });

      const firstResult = await reconcileMissingNotifications(
        createAccountNotifications([notificationA, notificationB]),
        createAccountNotifications([notificationB]),
        transientMisses,
        verifyStillUnread,
        0,
        1000,
      );

      expect(firstResult[0].notifications.map((n) => n.id).sort()).toEqual([
        'a',
        'b',
      ]);

      const stillWithinGrace = await reconcileMissingNotifications(
        firstResult,
        createAccountNotifications([notificationB]),
        transientMisses,
        verifyStillUnread,
        999,
        1000,
      );

      expect(stillWithinGrace[0].notifications.map((n) => n.id).sort()).toEqual(
        ['a', 'b'],
      );

      const afterGrace = await reconcileMissingNotifications(
        stillWithinGrace,
        createAccountNotifications([notificationB]),
        transientMisses,
        verifyStillUnread,
        1000,
        1000,
      );

      expect(afterGrace[0].notifications.map((n) => n.id)).toEqual(['b']);
    });

    it('clears the miss timer when the notification returns', async () => {
      const notificationA = createNotification('a', 'group-a', 2);
      const notificationB = createNotification('b', 'group-b', 1);
      const transientMisses: TransientNotificationMisses = new Map();
      const verifyStillUnread = vi.fn(async () => {
        throw new Error('verification failed');
      });

      const retained = await reconcileMissingNotifications(
        createAccountNotifications([notificationA, notificationB]),
        createAccountNotifications([notificationB]),
        transientMisses,
        verifyStillUnread,
        0,
        1000,
      );

      const restored = await reconcileMissingNotifications(
        retained,
        createAccountNotifications([notificationA, notificationB]),
        transientMisses,
        verifyStillUnread,
        5000,
        1000,
      );

      expect(restored[0].notifications.map((n) => n.id).sort()).toEqual([
        'a',
        'b',
      ]);

      const retainedAgain = await reconcileMissingNotifications(
        restored,
        createAccountNotifications([notificationB]),
        transientMisses,
        verifyStillUnread,
        5001,
        1000,
      );

      expect(retainedAgain[0].notifications.map((n) => n.id).sort()).toEqual([
        'a',
        'b',
      ]);
    });

    it('does not verify or retain notifications when the account fetch failed', async () => {
      const notificationA = createNotification('a', 'group-a', 2);
      const transientMisses: TransientNotificationMisses = new Map();
      const verifyStillUnread = vi.fn(async () => true);

      const result = await reconcileMissingNotifications(
        createAccountNotifications([notificationA]),
        createAccountNotifications([], Errors.UNKNOWN),
        transientMisses,
        verifyStillUnread,
        0,
        1000,
      );

      expect(result[0].notifications).toEqual([]);
      expect(result[0].error).toBe(Errors.UNKNOWN);
      expect(verifyStillUnread).not.toHaveBeenCalled();
    });

    it('does not duplicate a group when its head notification changes', async () => {
      const oldHead = createNotification('old-head', 'shared-group', 2);
      const newHead = createNotification('new-head', 'shared-group', 2);
      const transientMisses: TransientNotificationMisses = new Map();
      const verifyStillUnread = vi.fn(async () => true);

      const result = await reconcileMissingNotifications(
        createAccountNotifications([oldHead]),
        createAccountNotifications([newHead]),
        transientMisses,
        verifyStillUnread,
        0,
        1000,
      );

      expect(result[0].notifications.map((n) => n.id)).toEqual(['new-head']);
      expect(verifyStillUnread).not.toHaveBeenCalled();
    });

    it('retains flat notifications that the API confirms are still unread', async () => {
      const notificationA = createNotification('a', 'shared-group', 1);
      const notificationB = createNotification('b', 'shared-group', 1);
      const transientMisses: TransientNotificationMisses = new Map();
      const verifyStillUnread = vi.fn(async () => true);

      const result = await reconcileMissingNotifications(
        createAccountNotifications([notificationA, notificationB]),
        createAccountNotifications([notificationB]),
        transientMisses,
        verifyStillUnread,
        0,
        1000,
      );

      expect(result[0].notifications.map((n) => n.id).sort()).toEqual([
        'a',
        'b',
      ]);
    });

    it('trusts the feed for bulk removals instead of verifying each one', async () => {
      const notifications = Array.from({ length: 3 }, (_, index) =>
        createNotification(`n${index}`, `group-${index}`, 2),
      );
      const transientMisses: TransientNotificationMisses = new Map();
      const verifyStillUnread = vi.fn(async () => true);

      const result = await reconcileMissingNotifications(
        createAccountNotifications(notifications),
        createAccountNotifications([]),
        transientMisses,
        verifyStillUnread,
        0,
        1000,
        2,
      );

      expect(result[0].notifications).toEqual([]);
      expect(verifyStillUnread).not.toHaveBeenCalled();
      expect(transientMisses.size).toBe(0);
    });
  });
});
