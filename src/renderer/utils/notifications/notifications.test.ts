import { mockSingleAccountNotifications } from '../../__mocks__/notifications-mocks';

import { getNotificationCount, hasMoreNotifications } from './notifications';

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
});
