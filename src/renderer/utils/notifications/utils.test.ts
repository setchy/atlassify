import {
  mockAtlassianCloudAccount,
  mockAtlassianCloudAccountTwo,
} from '../../__mocks__/account-mocks';
import { createMockNotificationForProductType } from '../../__mocks__/notifications-mocks';

import type { AccountNotifications } from '../../types';

import { getNewNotifications } from './utils';

describe('renderer/utils/notifications/utils.ts', () => {
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
});
