import ChevronDownIcon from '@atlaskit/icon/utility/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/utility/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/utility/chevron-right';

import {
  mockAtlassifyNotifications,
  mockSingleAtlassifyNotification,
} from '../__mocks__/notifications-mocks';
import {
  formatNativeNotificationFooterText,
  formatNotificationFooterText,
  formatNotificationUpdatedAt,
  getChevronDetails,
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
      it('use path title when available ', () => {
        expect(
          formatNotificationFooterText(mockAtlassifyNotifications[1]),
        ).toBe('Atlassify Space');
      });

      it('bitbucket mapping', () => {
        expect(
          formatNotificationFooterText(mockAtlassifyNotifications[0]),
        ).toBe('myorg/notifications-test');
      });

      it('default product mapping', () => {
        const mockNotification = mockAtlassifyNotifications[1];
        mockNotification.path = null;

        expect(formatNotificationFooterText(mockNotification)).toBe(
          'Confluence',
        );
      });
    });

    describe('formatNativeNotificationFooterText', () => {
      it('use entity title when available ', () => {
        const mockNotification = mockAtlassifyNotifications[1];

        expect(formatNativeNotificationFooterText(mockNotification)).toBe(
          'Atlassify Space: Atlassify Home',
        );
      });

      it('default case', () => {
        const mockNotification = mockAtlassifyNotifications[1];
        mockNotification.entity.title = null;

        expect(formatNativeNotificationFooterText(mockNotification)).toBe(
          'Atlassify Space',
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

  describe('getChevronDetails', () => {
    it('should return correct chevron details', () => {
      expect(getChevronDetails(true, true, 'account')).toEqual({
        icon: ChevronDownIcon,
        label: 'Hide account notifications',
      });

      expect(getChevronDetails(true, false, 'account')).toEqual({
        icon: ChevronRightIcon,
        label: 'Show account notifications',
      });

      expect(getChevronDetails(false, false, 'account')).toEqual({
        icon: ChevronLeftIcon,
        label: 'No notifications for account',
      });
    });
  });
});
