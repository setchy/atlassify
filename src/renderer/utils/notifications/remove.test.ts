import { mockAtlassianCloudAccountTwo } from '../../__mocks__/account-mocks';
import {
  mockSingleAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';
import { mockSettings } from '../../__mocks__/state-mocks';

import type { SettingsState } from '../../types';

import { shouldRemoveNotificationsFromState } from './remove';

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
      const settings: SettingsState = {
        ...mockSettings,
        delayNotificationState,
        fetchOnlyUnreadNotifications,
      };

      expect(shouldRemoveNotificationsFromState(settings)).toBe(expected);
    });
  });
});
