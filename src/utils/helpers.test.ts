import { mockSingleNotification } from '../__mocks__/notifications-mocks';
import { formatNotificationUpdatedAt } from './helpers';

describe('utils/helpers.ts', () => {
  describe('formatting', () => {
    describe('formatNotificationUpdatedAt', () => {
      it('should use updated_at if last_read_at is null', () => {
        const notification = {
          ...mockSingleNotification,
          last_read_at: null,
          updated_at: '2021-06-23T17:00:00Z',
        };

        expect(formatNotificationUpdatedAt(notification)).toContain('ago');
      });

      it('should return empty if all dates are null', () => {
        const notification = {
          ...mockSingleNotification,
          last_read_at: null,
          updated_at: null,
        };

        expect(formatNotificationUpdatedAt(notification)).toBe('');
      });

      it('should return empty if unable to parse dates', () => {
        const notification = {
          ...mockSingleNotification,
          last_read_at: 'not an iso date',
          updated_at: 'not an iso date',
        };

        expect(formatNotificationUpdatedAt(notification)).toBe('');
      });
    });
  });
});
