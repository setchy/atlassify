import { mockAtlassianCloudAccountTwo } from '../../__mocks__/account-mocks';
import {
  mockSingleAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import { useSettingsStore } from '../../stores';

import type { NotificationActionType } from './postProcess';
import {
  removeNotificationsForAccount,
  shouldRemoveNotificationsFromState,
} from './remove';

describe('renderer/utils/notifications/remove.ts', () => {
  describe('shouldRemoveNotificationsFromState', () => {
    it.each([
      {
        delayNotificationState: false,
        fetchOnlyUnreadNotifications: false,
        expected: false,
        description:
          'both delayNotificationState and fetchOnlyUnreadNotifications are false',
      },
      {
        delayNotificationState: true,
        fetchOnlyUnreadNotifications: false,
        expected: false,
        description: 'delayNotificationsState is true',
      },
      {
        delayNotificationState: false,
        fetchOnlyUnreadNotifications: true,
        expected: true,
        description: 'fetchOnlyUnreadNotifications is true',
      },
      {
        delayNotificationState: true,
        fetchOnlyUnreadNotifications: true,
        expected: false,
        description:
          'both delayNotificationState and fetchOnlyUnreadNotifications are true',
      },
    ])('should return $expected when read action and $description', ({
      delayNotificationState,
      fetchOnlyUnreadNotifications,
      expected,
    }) => {
      useSettingsStore.setState({
        delayNotificationState,
        fetchOnlyUnreadNotifications,
      });

      expect(
        shouldRemoveNotificationsFromState('read' as NotificationActionType),
      ).toBe(expected);
    });

    it('should return false for unread action regardless of settings', () => {
      expect(
        shouldRemoveNotificationsFromState('unread' as NotificationActionType),
      ).toBe(false);
    });
  });

  describe('removeNotificationsForAccount', () => {
    it('should remove a notification if it exists', () => {
      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set([mockSingleAtlassifyNotification.id]),
      );

      expect(result[0].notifications.length).toBe(0);
    });

    it('should skip notification removal if no matching IDs to remove', () => {
      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set(['non-existent-id']),
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });

    it('should skip notification removal if nothing to remove', () => {
      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set(),
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });

    it('should skip notification removal if no matching accounts found', () => {
      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockAtlassianCloudAccountTwo,
        mockSingleAccountNotifications,
        new Set(['some-unknown-id']),
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });

    it('should skip notification removal if should not remove', () => {
      // Set store state so shouldRemoveNotificationsFromState returns false
      useSettingsStore.setState({
        delayNotificationState: false,
        fetchOnlyUnreadNotifications: false,
      });

      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set([mockSingleAtlassifyNotification.id]),
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });
  });
});
