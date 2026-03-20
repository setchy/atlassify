import {
  mockAtlassifyNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import {
  formatNativeNotificationFooterText,
  formatNotificationUpdatedAt,
  formatProperCase,
} from './formatters';

describe('renderer/utils/notifications/formatters.ts', () => {
  describe('formatters', () => {
    it('formatProperCase', () => {
      expect(formatProperCase(null)).toBe('');
      expect(formatProperCase('')).toBe('');
      expect(formatProperCase('OUTDATED discussion')).toBe(
        'Outdated Discussion',
      );
    });

    describe('formatNativeNotificationFooterText', () => {
      it('use entity title when available ', () => {
        expect(
          formatNativeNotificationFooterText(mockAtlassifyNotifications[1]),
        ).toBe('Atlassify Space: Atlassify Home');
      });

      it('default case', () => {
        expect(
          formatNativeNotificationFooterText({
            ...mockAtlassifyNotifications[1],
            entity: {
              title: null,
              iconUrl: null,
              url: null,
            },
          }),
        ).toBe('Atlassify Space');
      });
    });

    describe('formatNotificationUpdatedAt', () => {
      it('should format updated_at if valid iso date', () => {
        const notification = {
          ...mockSingleAtlassifyNotification,
          updated_at: '2021-06-23T17:00:00Z',
        };

        expect(formatNotificationUpdatedAt(notification)).toContain('ago');
      });

      it('should return empty if all dates are null', () => {
        const notification = {
          ...mockSingleAtlassifyNotification,
          updated_at: null,
        };

        expect(formatNotificationUpdatedAt(notification)).toBe('');
      });

      it('should return empty if unable to parse dates', () => {
        const notification = {
          ...mockSingleAtlassifyNotification,
          updated_at: 'not an iso date',
        };

        expect(formatNotificationUpdatedAt(notification)).toBe('');
      });
    });
  });
});
