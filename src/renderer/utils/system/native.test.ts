import {
  mockAccountNotifications,
  mockSingleAccountNotifications,
  mockSystemAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import { resolveNotificationUrl } from './links';
import * as native from './native';

describe('renderer/utils/system/native.ts', () => {
  it('should raise a native notification for a single new notification', () => {
    native.raiseNativeNotification(
      mockSingleAccountNotifications[0].notifications,
    );

    expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledTimes(1);

    expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledWith(
      expect.stringContaining(
        mockSingleAccountNotifications[0].notifications[0].message,
      ),
      expect.stringContaining(
        mockSingleAccountNotifications[0].notifications[0].message,
      ),
      mockSingleAccountNotifications[0].notifications[0].url,
    );
  });

  it('should raise a native notification for multiple new notifications', () => {
    native.raiseNativeNotification(mockAccountNotifications[0].notifications);

    expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledTimes(1);

    expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledWith(
      'Atlassify',
      'You have 2 notifications',
      null,
    );
  });

  it('should raise a native notification for a null-entity notification using the same URL as in-app clicks, without throwing', () => {
    expect(() =>
      native.raiseNativeNotification([mockSystemAtlassifyNotification]),
    ).not.toThrow();

    expect(window.atlassify.raiseNativeNotification).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      resolveNotificationUrl(mockSystemAtlassifyNotification),
    );
  });
});
