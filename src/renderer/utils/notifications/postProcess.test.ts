import { mockAtlassianCloudAccountTwo } from '../../__mocks__/account-mocks';
import {
  mockAccountNotifications,
  mockSingleAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import { useSettingsStore } from '../../stores';

import {
  postProcessNotifications,
  removeNotificationsForAccount,
  shouldRemoveNotificationsFromState,
  updateNotificationsReadState,
} from './postProcess';

describe('renderer/utils/notifications/postProcess.ts', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      fetchOnlyUnreadNotifications: false,
      delayNotificationState: false,
    });
  });

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

      expect(shouldRemoveNotificationsFromState()).toBe(expected);
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
  });

  describe('updateNotificationsReadState', () => {
    it('should update readState for a matching notification', () => {
      const result = updateNotificationsReadState(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set([mockSingleAtlassifyNotification.id]),
        'read',
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result[0].notifications[0].readState).toBe('read');
    });

    it('should not update readState if no matching IDs to update', () => {
      const result = updateNotificationsReadState(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set(['non-existent-id']),
        'read',
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });

    it('should not update readState if nothing to update', () => {
      const result = updateNotificationsReadState(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        new Set(),
        'read',
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });

    it('should not update readState if no matching accounts found', () => {
      const result = updateNotificationsReadState(
        mockAtlassianCloudAccountTwo,
        mockSingleAccountNotifications,
        new Set([mockSingleAtlassifyNotification.id]),
        'read',
      );

      expect(result[0].notifications.length).toBe(1);
      expect(result).toEqual(mockSingleAccountNotifications);
    });

    it('should update readState for multiple notifications if IDs match', () => {
      const result = updateNotificationsReadState(
        mockAccountNotifications[0].account,
        mockAccountNotifications,
        new Set([
          mockAccountNotifications[0].notifications[0].id,
          mockAccountNotifications[0].notifications[1].id,
        ]),
        'read',
      );

      expect(result[0].notifications[0].readState).toBe('read');
      expect(result[0].notifications[1].readState).toBe('read');
    });
  });

  describe('postProcessNotifications', () => {
    it('should update readState for affected notifications', () => {
      const affected = [{ ...mockSingleAtlassifyNotification }];
      const result = postProcessNotifications(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        affected,
        'read',
      );

      expect(result[0].notifications).toBeDefined();

      if (result[0].notifications.length > 0) {
        expect(result[0].notifications[0].readState).toBe('read');
      }
    });

    it('should remove notifications if shouldRemoveNotificationsFromState returns true', () => {
      useSettingsStore.setState({
        fetchOnlyUnreadNotifications: true,
        delayNotificationState: false,
      });

      const affected = [{ ...mockSingleAtlassifyNotification }];

      const result = postProcessNotifications(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        affected,
        'read',
      );

      expect(result[0].notifications).toBeDefined();
      expect(result[0].notifications.length).toBe(0);
    });

    it('should not remove notifications when actionType is "unread"', () => {
      useSettingsStore.setState({
        fetchOnlyUnreadNotifications: true,
        delayNotificationState: false,
      });

      const affected = [{ ...mockSingleAtlassifyNotification }];

      const result = postProcessNotifications(
        mockSingleAccountNotifications[0].account,
        mockSingleAccountNotifications,
        affected,
        'unread',
      );

      expect(result[0].notifications.length).toEqual(
        mockSingleAccountNotifications[0].notifications.length,
      );
    });
  });
});
