import {
  createMockNotificationForProductType,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import useSettingsStore from '../../stores/useSettingsStore';

import type { AtlassifyNotification } from '../../types';

import {
  getFlattenedNotificationsByProduct,
  groupNotificationsByProduct,
  isGroupNotification,
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

  describe('getFlattenedNotificationsByProduct', () => {
    it('returns product-grouped order when groupNotificationsByProduct is true', () => {
      useSettingsStore.setState({
        groupNotificationsByProduct: true,
      });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'bitbucket'),
        createMockNotificationForProductType('4', 'confluence'),
      ];

      const result = getFlattenedNotificationsByProduct(notifications);

      // First repo-b notifications, then repo-a notifications
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

      // First repo-b notifications, then repo-a notifications
      expect(result.map((n) => n.id)).toEqual(['1', '3', '2', '4']);
    });

    it('returns natural account order when groupNotificationsByProduct is false', () => {
      useSettingsStore.setState({
        groupNotificationsByProduct: false,
      });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = getFlattenedNotificationsByProduct(notifications);

      // Natural order preserved
      expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
    });

    it('returns empty array when no notifications', () => {
      const notifications: AtlassifyNotification[] = [];

      const result = getFlattenedNotificationsByProduct(notifications);

      expect(result).toEqual([]);
    });

    it('handles notifications without product data when grouped', () => {
      useSettingsStore.setState({
        groupNotificationsByProduct: true,
      });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', null),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = getFlattenedNotificationsByProduct(notifications);

      // Only notifications with repository data are included when grouped
      expect(result.map((n) => n.id)).toEqual(['1', '3']);
    });

    it('preserves notifications without product data when not grouped', () => {
      useSettingsStore.setState({
        groupNotificationsByProduct: false,
      });

      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', null),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = getFlattenedNotificationsByProduct(notifications);

      // All notifications preserved in natural order
      expect(result.map((n) => n.id)).toEqual(['1', '2', '3']);
    });
  });
});
