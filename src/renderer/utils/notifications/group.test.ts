import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';
import {
  createMockNotificationForProductType,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import { useSettingsStore } from '../../stores';

import type { AtlassifyNotification } from '../../types';

import {
  getFlattenedNotificationsByProduct,
  getNotificationIdsForGroups,
  groupNotificationsByProduct,
  groupNotificationsByProductEntries,
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

  describe('groupNotificationsByProduct', () => {
    it('groups notifications by product type', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = groupNotificationsByProduct(notifications);

      expect(result.size).toBe(2);
      expect(result.get('bitbucket')?.map((n) => n.id)).toEqual(['1', '3']);
      expect(result.get('confluence')?.map((n) => n.id)).toEqual(['2']);
    });

    it('preserves first-seen product order', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'jira'),
        createMockNotificationForProductType('4', 'confluence'),
      ];

      const result = groupNotificationsByProduct(notifications);
      const keys = Array.from(result.keys());

      expect(keys).toEqual(['bitbucket', 'confluence', 'jira']);
    });

    it('skips notifications without product data', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', null),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = groupNotificationsByProduct(notifications);

      expect(result.size).toBe(1);
      expect(result.get('bitbucket')?.map((n) => n.id)).toEqual(['1', '3']);
    });

    it('returns empty map when no notifications', () => {
      const notifications: AtlassifyNotification[] = [];

      const result = groupNotificationsByProduct(notifications);

      expect(result.size).toBe(0);
    });

    it('returns empty map when all notifications lack product data', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', null),
        createMockNotificationForProductType('2', null),
      ];

      const result = groupNotificationsByProduct(notifications);

      expect(result.size).toBe(0);
    });
  });

  describe('groupNotificationsByProductEntries', () => {
    it('preserves first-seen product order when alphabetically is false', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'jira'),
        createMockNotificationForProductType('2', 'bitbucket'),
        createMockNotificationForProductType('3', 'jira'),
      ];

      const result = groupNotificationsByProductEntries(notifications, false);

      expect(result.map(([key]) => key)).toEqual(['jira', 'bitbucket']);
      expect(result[0][1].map((n) => n.id)).toEqual(['1', '3']);
      expect(result[1][1].map((n) => n.id)).toEqual(['2']);
    });

    it('sorts groups alphabetically when alphabetically is true', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'jira'),
        createMockNotificationForProductType('2', 'bitbucket'),
        createMockNotificationForProductType('3', 'confluence'),
      ];

      const result = groupNotificationsByProductEntries(notifications, true);

      expect(result.map(([key]) => key)).toEqual([
        'bitbucket',
        'confluence',
        'jira',
      ]);
    });

    it('returns empty array when no notifications', () => {
      const result = groupNotificationsByProductEntries([], false);

      expect(result).toEqual([]);
    });

    it('skips notifications without product data', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', null),
      ];

      const result = groupNotificationsByProductEntries(notifications, false);

      expect(result).toHaveLength(1);
      expect(result[0][0]).toBe('bitbucket');
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

  describe('getFlattenedNotificationsByProduct', () => {
    it('returns product-grouped order when groupNotificationsByProduct is true', () => {
      useSettingsStore.setState({ groupNotificationsByProduct: true });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'bitbucket'),
        createMockNotificationForProductType('4', 'confluence'),
      ];

      const result = getFlattenedNotificationsByProduct(notifications);

      expect(result.map((n) => n.id)).toEqual(['1', '3', '2', '4']);
    });

    it('returns product-grouped order when groupNotificationsByProductAlphabetically is true', () => {
      useSettingsStore.setState({
        groupNotificationsByProductAlphabetically: true,
      });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'bitbucket'),
        createMockNotificationForProductType('4', 'confluence'),
      ];

      const result = getFlattenedNotificationsByProduct(notifications);

      expect(result.map((n) => n.id)).toEqual(['1', '3', '2', '4']);
    });

    it('returns natural account order when both flags are false', () => {
      useSettingsStore.setState({ groupNotificationsByProduct: false });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = getFlattenedNotificationsByProduct(notifications);

      expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
    });

    it('returns empty array when no notifications', () => {
      expect(getFlattenedNotificationsByProduct([])).toEqual([]);
    });

    it('handles notifications without product data when grouped', () => {
      useSettingsStore.setState({ groupNotificationsByProduct: true });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', null),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = getFlattenedNotificationsByProduct(notifications);

      expect(result.map((n) => n.id)).toEqual(['1', '3']);
    });

    it('preserves notifications without product data when not grouped', () => {
      useSettingsStore.setState({ groupNotificationsByProduct: false });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', null),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = getFlattenedNotificationsByProduct(notifications);

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
