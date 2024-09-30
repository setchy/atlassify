import {
  mockSingleAccountNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';
import { mockSettings } from '../../__mocks__/state-mocks';
import { removeNotifications } from './remove';

describe('renderer/utils/notifications/remove.ts', () => {
  it('should remove a notification if it exists', () => {
    expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

    const result = removeNotifications(
      { ...mockSettings, delayNotificationState: false },
      [mockSingleAtlassifyNotification],
      mockSingleAccountNotifications,
    );

    expect(result[0].notifications.length).toBe(0);
  });

  it('should skip notification removal if delay state enabled', () => {
    expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

    const result = removeNotifications(
      { ...mockSettings, delayNotificationState: true },
      [mockSingleAtlassifyNotification],
      mockSingleAccountNotifications,
    );

    expect(result[0].notifications.length).toBe(1);
  });

  it('should skip notification removal if none match', () => {
    expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

    const result = removeNotifications(
      { ...mockSettings },
      [],
      mockSingleAccountNotifications,
    );

    expect(result[0].notifications.length).toBe(1);
  });

  it('should skip notification removal if no matching accounts found', () => {
    expect(mockSingleAccountNotifications[0].notifications.length).toBe(1);

    const result = removeNotifications(
      { ...mockSettings },
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
  });
});
