import {
  mockAtlassifyNotifications,
  mockSingleAtlassifyNotification,
} from '../../__mocks__/notifications-mocks';

import type { Link } from '../../types';

import { PRODUCTS } from '../products';
import {
  formatNativeNotificationFooterText,
  formatNotificationBodyText,
  formatNotificationFooterText,
  formatNotificationUpdatedAt,
  formatProperCase,
} from './formatters';

describe('renderer/utils/notifications/formatters.ts', () => {
  it('formatProperCase', () => {
    expect(formatProperCase(null)).toBe('');
    expect(formatProperCase('')).toBe('');
    expect(formatProperCase('OUTDATED discussion')).toBe('Outdated Discussion');
  });

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
      expect(formatNotificationFooterText(mockAtlassifyNotifications[1])).toBe(
        'Atlassify Space',
      );
    });

    it('bitbucket mapping', () => {
      expect(formatNotificationFooterText(mockAtlassifyNotifications[0])).toBe(
        'myorg/notifications-test',
      );
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
