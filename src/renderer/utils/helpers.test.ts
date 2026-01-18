import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import {
  mockAtlassifyNotifications,
  mockSingleAtlassifyNotification,
} from '../__mocks__/notifications-mocks';

import type { Link } from '../types';

import {
  blockAlignmentByLength,
  extractRepositoryName,
  extractRovoDevContextName,
  formatNativeNotificationFooterText,
  formatNotificationBodyText,
  formatNotificationFooterText,
  formatNotificationUpdatedAt,
  getChevronDetails,
  isCompassScorecardNotification,
} from './helpers';
import { PRODUCTS } from './products';

describe('renderer/utils/helpers.ts', () => {
  describe('formatting', () => {
    describe('formatNotificationBodyText', () => {
      it('rovo dev mapping ', () => {
        expect(
          formatNotificationBodyText({
            ...mockAtlassifyNotifications[1],
            product: PRODUCTS.rovo_dev,
            url: 'https://atlassify.atlassian.net/browse/ATLASSIFY-123?showAutodev=true' as Link,
          }),
        ).toBe('The AI coding tool has generated code for ATLASSIFY-123');
      });

      it('default mapping', () => {
        expect(formatNotificationBodyText(mockAtlassifyNotifications[1])).toBe(
          'Atlassify Home',
        );
      });
    });

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

      describe('atlassian home mappings', () => {
        it('atlassian home - project', () => {
          expect(
            formatNotificationFooterText({
              ...mockAtlassifyNotifications[1],
              product: PRODUCTS.home,
              path: {
                title: 'Atlassian Home • Pending',
                iconUrl: null,
                url: 'https://home.atlassian.com/o/some-guid/project/ABC-123/about' as Link,
              },
            }),
          ).toBe('ABC-123 • Pending');
        });

        it('atlassian home - goal', () => {
          expect(
            formatNotificationFooterText({
              ...mockAtlassifyNotifications[1],
              product: PRODUCTS.home,
              path: {
                title: 'Goals • On track',
                iconUrl: null,
                url: 'https://home.atlassian.com/o/some-guid/goal/ABC-123/about' as Link,
              },
            }),
          ).toBe('ABC-123 • On track');
        });

        it('atlassian home - kudos', () => {
          expect(
            formatNotificationFooterText({
              ...mockAtlassifyNotifications[1],
              product: PRODUCTS.home,
              path: {
                title: 'Atlassian Home',
                iconUrl: null,
                url: 'https://home.atlassian.com/o/some-guid/people/kudos/some-guid' as Link,
              },
            }),
          ).toBe('Atlassian Home');
        });
      });

      it('default product mapping', () => {
        expect(
          formatNotificationFooterText({
            ...mockAtlassifyNotifications[1],
            path: null,
          }),
        ).toBe('Confluence');
      });
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

  describe('extracting', () => {
    it('extractRepositoryName', () => {
      const mockNotif = mockSingleAtlassifyNotification;

      expect(extractRepositoryName(mockNotif)).toBe('myorg/notifications-test');
    });

    it('extractRovoDevContextName', () => {
      const mockNotif = mockSingleAtlassifyNotification;
      mockNotif.url =
        'https://atlassify.atlassian.net/browse/ATLASSIFY-123?showAutodev=true' as Link;

      expect(extractRovoDevContextName(mockNotif)).toBe(
        'The AI coding tool has generated code for ATLASSIFY-123',
      );
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

      expect(getChevronDetails(false, false, 'product')).toEqual({
        icon: ChevronLeftIcon,
        label: 'No notifications for product',
      });
    });
  });

  it('blockAlignmentByLength', () => {
    expect(blockAlignmentByLength(null)).toEqual('center');

    expect(blockAlignmentByLength('Some short string')).toEqual('center');

    expect(
      blockAlignmentByLength(
        'Some much longer string that should trigger a different format',
      ),
    ).toEqual('start');
  });

  describe('isCompassScorecardNotification', () => {
    it('should return true for compass scorecard notifications', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'some-project improved a scorecard',
      };

      expect(isCompassScorecardNotification(mockNotification)).toBe(true);
    });

    it('should return false for non-compass notifications', () => {
      const mockNotification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.confluence,
        message: 'This is a scorecard wiki',
      };

      expect(isCompassScorecardNotification(mockNotification)).toBe(false);
    });
  });
});
