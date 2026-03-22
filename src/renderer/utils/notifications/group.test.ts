import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import {
  createMockNotificationForProductType,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import { useSettingsStore } from '../../stores';

import type { AtlassifyNotification } from '../../types';

import {
  flattenGroupedNotifications,
  getNotificationIdsForGroups,
  isGroupNotification,
  sortNotificationsByOrder,
} from './group';

describe('renderer/utils/notifications/group.ts', () => {
  describe('isGroupNotification', () => {
    it('should return false if insufficient group size', () => {
      mockSingleAtlassifyNotification.notificationGroup.size = 1;

      const result = isGroupNotification(mockSingleAtlassifyNotification);

      expect(result).toBe(false);
    });

    it('should return true if insufficient group size', () => {
      mockSingleAtlassifyNotification.notificationGroup.size = 2;

      const result = isGroupNotification(mockSingleAtlassifyNotification);

      expect(result).toBe(true);
    });
  });

  describe('sortNotificationsByOrder', () => {
    it('sorts notifications ascending by order field', () => {
      const notifications: AtlassifyNotification[] = [
        { ...createMockNotificationForProductType('3', 'jira'), order: 2 },
        { ...createMockNotificationForProductType('1', 'jira'), order: 0 },
        { ...createMockNotificationForProductType('2', 'jira'), order: 1 },
      ];

      const result = sortNotificationsByOrder(notifications);

      expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
    });

    it('does not mutate the original array', () => {
      const notifications: AtlassifyNotification[] = [
        { ...createMockNotificationForProductType('2', 'jira'), order: 1 },
        { ...createMockNotificationForProductType('1', 'jira'), order: 0 },
      ];
      const original = [...notifications];

      sortNotificationsByOrder(notifications);

      expect(notifications.map((n) => n.id)).toEqual(original.map((n) => n.id));
    });

    it('returns empty array when no notifications', () => {
      expect(sortNotificationsByOrder([])).toEqual([]);
    });
  });

  describe('flattenGroupedNotifications', () => {
    it('returns product-grouped order when groupBy is product', () => {
      useSettingsStore.setState({ groupBy: 'product' });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'bitbucket'),
        createMockNotificationForProductType('4', 'confluence'),
      ];

      const result = flattenGroupedNotifications(notifications);

      expect(result.map((n) => n.id)).toEqual(['1', '3', '2', '4']);
    });

    it('returns natural order when groupBy is none', () => {
      useSettingsStore.setState({ groupBy: 'none' });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = flattenGroupedNotifications(notifications);

      expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
    });

    it('returns empty array when no notifications', () => {
      expect(flattenGroupedNotifications([])).toEqual([]);
    });

    it('handles notifications without product data when grouped', () => {
      useSettingsStore.setState({ groupBy: 'product' });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', null),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = flattenGroupedNotifications(notifications);

      expect(result.map((n) => n.id)).toEqual(['1', '3']);
    });

    it('preserves notifications without product data when not grouped', () => {
      useSettingsStore.setState({ groupBy: 'none' });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', null),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = flattenGroupedNotifications(notifications);

      expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
    });
  });

  describe('getNotificationIdsForGroups', () => {
    it('returns empty array if no notifications', async () => {
      const result = await getNotificationIdsForGroups(
        mockAtlassianCloudAccount,
        [],
      );

      expect(result).toEqual([]);
    });
  });
});
