import { mockAtlassianCloudAccountTwo } from '../../__mocks__/account-mocks';
import {
  mockSingleAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import useSettingsStore from '../../stores/useSettingsStore';

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
    ])('should return $expected when $description', ({
      delayNotificationState,
      fetchOnlyUnreadNotifications,
      expected,
    }) => {
      useSettingsStore.setState({
        delayNotificationState,
        fetchOnlyUnreadNotifications,
      });

      expect(shouldRemoveNotificationsFromState()).toBe(expected);
    });
  });

  describe('removeNotificationsForAccount', () => {
    it('should remove a notification if it exists', () => {
      useSettingsStore.setState({
        delayNotificationState: false,
      });

      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockSingleAccountNotifications[0].account,
        [mockSingleAtlassifyNotification],
        mockSingleAccountNotifications,
      );

      expect(result[0].notifications.length).toBe(0);
    });

    it('should mark as read and skip notification removal if delay state enabled', () => {
      useSettingsStore.setState({
        delayNotificationState: true,
      });

      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockSingleAccountNotifications[0].account,
        [mockSingleAtlassifyNotification],
        mockSingleAccountNotifications,
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result[0].notifications[0].readState).toBe('read');
    });

    it('should skip notification removal if delay state enabled and nothing to remove', () => {
      useSettingsStore.setState({
        delayNotificationState: true,
      });

      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockSingleAccountNotifications[0].account,
        [
          {
            ...mockSingleAtlassifyNotification,
            id: 'non-existent-id',
          },
        ],
        mockSingleAccountNotifications,
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result[0].notifications[0].readState).toBe('unread');
    });

    it('should skip notification removal if nothing to remove', () => {
      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockSingleAccountNotifications[0].account,
        [],
        mockSingleAccountNotifications,
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result[0].notifications[0]).toBe(
        mockSingleAccountNotifications[0].notifications[0],
      );
    });

    it('should skip notification removal if no matching accounts found', () => {
      expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

      const result = removeNotificationsForAccount(
        mockAtlassianCloudAccountTwo,
        [
          {
            ...mockSingleAtlassifyNotification,
            account: {
              ...mockSingleAtlassifyNotification.account,
              id: 'some-unknown-account',
            },
          },
        ],
        mockSingleAccountNotifications,
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result[0].notifications[0]).toBe(
        mockSingleAccountNotifications[0].notifications[0],
      );
    });
  });
});
