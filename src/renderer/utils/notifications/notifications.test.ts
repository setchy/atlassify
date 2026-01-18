import {
  mockSingleAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import {
  getNotificationCount,
  hasMoreNotifications,
  isGroupNotification,
} from './notifications';

describe('renderer/utils/notifications/notifications.ts', () => {
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
});
