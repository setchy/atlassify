import { defaultSettings } from '../context/App';
import type { SettingsState } from '../types';
import { mockSingleNotification } from './api/__mocks__/response-mocks';
import {
  formatForDisplay,
  formatNotificationUpdatedAt,
  getFilterCount,
} from './helpers';

describe('utils/helpers.ts', () => {
  describe('formatting', () => {
    it('formatForDisplay', () => {
      expect(formatForDisplay(null)).toBe('');
      expect(formatForDisplay([])).toBe('');
      expect(formatForDisplay(['open', 'PullRequest'])).toBe(
        'Open Pull Request',
      );
      expect(formatForDisplay(['OUTDATED', 'Discussion'])).toBe(
        'Outdated Discussion',
      );
      expect(formatForDisplay(['not_planned', 'Issue'])).toBe(
        'Not Planned Issue',
      );
    });

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

  describe('filter count', () => {
    it('default filter settings', () => {
      expect(getFilterCount(defaultSettings)).toBe(0);
    });

    it('non-default reason filters', () => {
      const settings = {
        ...defaultSettings,
        filterReasons: ['subscribed', 'manual'],
      } as SettingsState;
      expect(getFilterCount(settings)).toBe(2);
    });

    it('non-default bot filters', () => {
      const settings = {
        ...defaultSettings,
        hideBots: true,
      } as SettingsState;
      expect(getFilterCount(settings)).toBe(1);
    });
  });
});
