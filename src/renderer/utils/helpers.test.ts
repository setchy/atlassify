import {
  mockAtlassifyNotifications,
  mockSingleAtlassifyNotification,
} from '../__mocks__/notifications-mocks';
import {
  formatNotificationFooterText,
  formatNotificationUpdatedAt,
  getRepositoryName,
} from './helpers';

describe('renderer/utils/helpers.ts', () => {
  it('getRepositoryName', () => {
    expect(getRepositoryName(mockSingleAtlassifyNotification)).toBe(
      'myorg/notifications-test',
    );
  });

  describe('formatting', () => {
    describe('formatNotificationFooterText', () => {
      it('use product name if available mapping', () => {
        expect(
          formatNotificationFooterText(mockAtlassifyNotifications[1]),
        ).toBe('Atlassify Space');
      });

      it('bitbucket mapping', () => {
        expect(
          formatNotificationFooterText(mockAtlassifyNotifications[0]),
        ).toBe('myorg/notifications-test');
      });

      it('default mapping', () => {
        const mockNotification = mockAtlassifyNotifications[1];
        mockNotification.path = null;

        expect(formatNotificationFooterText(mockNotification)).toBe(
          'Confluence',
        );
      });
    });

    describe('formatNotificationUpdatedAt', () => {
      it('should use updated_at if last_read_at is null', () => {
        const notification = {
          ...mockSingleAtlassifyNotification,
          last_read_at: null,
          updated_at: '2021-06-23T17:00:00Z',
        };

        expect(formatNotificationUpdatedAt(notification)).toContain('ago');
      });

      it('should return empty if all dates are null', () => {
        const notification = {
          ...mockSingleAtlassifyNotification,
          last_read_at: null,
          updated_at: null,
        };

        expect(formatNotificationUpdatedAt(notification)).toBe('');
      });

      it('should return empty if unable to parse dates', () => {
        const notification = {
          ...mockSingleAtlassifyNotification,
          last_read_at: 'not an iso date',
          updated_at: 'not an iso date',
        };

        expect(formatNotificationUpdatedAt(notification)).toBe('');
      });
    });
  });
});
