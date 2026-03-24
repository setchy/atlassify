import { createMockNotificationForProductType } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification, ProductType } from '../../../types';

import { groupNotifications, sortGroupedEntries } from './utils';

describe('renderer/utils/notifications/grouping/utils.ts', () => {
  describe('groupNotifications', () => {
    it('groups notifications by group key', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = groupNotifications(
        notifications,
        (n) => n.product.type as ProductType,
      );

      expect(result.size).toBe(2);
      expect(result.get('bitbucket')?.map((n) => n.id)).toEqual(['1', '3']);
      expect(result.get('confluence')?.map((n) => n.id)).toEqual(['2']);
    });

    it('preserves first-seen order', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', 'confluence'),
        createMockNotificationForProductType('3', 'jira'),
        createMockNotificationForProductType('4', 'confluence'),
      ];

      const result = groupNotifications(
        notifications,
        (n) => n.product.type as ProductType,
      );
      const keys = Array.from(result.keys());

      expect(keys).toEqual(['bitbucket', 'confluence', 'jira']);
    });

    it('skips notifications without a group key', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', 'bitbucket'),
        createMockNotificationForProductType('2', null),
        createMockNotificationForProductType('3', 'bitbucket'),
      ];

      const result = groupNotifications(
        notifications,
        (n) => n.product.type as ProductType | undefined,
      );

      expect(result.size).toBe(1);
      expect(result.get('bitbucket')?.map((n) => n.id)).toEqual(['1', '3']);
    });

    it('returns empty map when no notifications', () => {
      const result = groupNotifications(
        [],
        (n) => n.product.type as ProductType,
      );

      expect(result.size).toBe(0);
    });

    it('returns empty map when all notifications lack group key', () => {
      const notifications: AtlassifyNotification[] = [
        createMockNotificationForProductType('1', null),
        createMockNotificationForProductType('2', null),
      ];

      const result = groupNotifications(
        notifications,
        (n) => n.product.type as ProductType | undefined,
      );

      expect(result.size).toBe(0);
    });
  });

  describe('sortGroupedEntries', () => {
    it('preserves original order when alphabetically is false', () => {
      const entries: [string, AtlassifyNotification[]][] = [
        ['jira', [createMockNotificationForProductType('1', 'jira')]],
        ['bitbucket', [createMockNotificationForProductType('2', 'bitbucket')]],
        ['jira', [createMockNotificationForProductType('3', 'jira')]],
      ];

      const result = sortGroupedEntries(entries, false);

      expect(result.map(([key]) => key)).toEqual(['jira', 'bitbucket', 'jira']);
    });

    it('sorts alphabetically when alphabetically is true', () => {
      const entries: [string, AtlassifyNotification[]][] = [
        ['jira', [createMockNotificationForProductType('1', 'jira')]],
        ['bitbucket', [createMockNotificationForProductType('2', 'bitbucket')]],
        [
          'confluence',
          [createMockNotificationForProductType('3', 'confluence')],
        ],
      ];

      const result = sortGroupedEntries(entries, true);

      expect(result.map(([key]) => key)).toEqual([
        'bitbucket',
        'confluence',
        'jira',
      ]);
    });

    it('returns empty array when no entries', () => {
      const result = sortGroupedEntries([], false);

      expect(result).toEqual([]);
    });
  });
});
