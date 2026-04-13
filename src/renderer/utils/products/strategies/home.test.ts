import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification, Link } from '../../../types';

import { PRODUCTS } from '../index';
import { extractGoalOrProjectKey } from './home';
import { getProductStrategy } from './index';

describe('renderer/utils/products/strategies/home', () => {
  describe('footerText', () => {
    it('footerText returns key + path title for goal url', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.home,
        path: {
          title: 'Goals • On track',
          iconUrl: null,
          url: 'https://home.atlassian.com/o/some-guid/goal/ABC-123/about' as Link,
        },
      } as AtlassifyNotification;

      expect(getProductStrategy(notification).footerText(notification)).toBe(
        'ABC-123 • On track',
      );
    });

    it('footerText returns key + path title for project url', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.home,
        path: {
          title: 'Atlassian Home • Pending',
          iconUrl: null,
          url: 'https://home.atlassian.com/o/some-guid/project/ABC-123/about' as Link,
        },
      } as AtlassifyNotification;

      expect(getProductStrategy(notification).footerText(notification)).toBe(
        'ABC-123 • Pending',
      );
    });

    it('footerText falls back to path title when no key', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.home,
        path: {
          title: 'Atlassian Home',
          iconUrl: null,
          url: 'https://home.atlassian.com/o/some-guid/people/kudos/some-guid' as Link,
        },
      } as AtlassifyNotification;

      expect(getProductStrategy(notification).footerText(notification)).toBe(
        'Atlassian Home',
      );
    });
  });

  describe('extractGoalOrProjectKey', () => {
    it('extractGoalOrProjectKey returns null when no match', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        path: {
          title: 'Atlassian Home',
          iconUrl: null,
          url: 'https://home.atlassian.com/' as Link,
        },
      } as AtlassifyNotification;

      expect(extractGoalOrProjectKey(notification)).toBeNull();
    });

    it('extractGoalOrProjectKey returns project key', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        path: {
          title: 'Atlassian Home • Pending',
          iconUrl: null,
          url: 'https://home.atlassian.com/o/some-guid/project/ABC-123/about' as Link,
        },
      } as AtlassifyNotification;

      expect(extractGoalOrProjectKey(notification)).toBe('ABC-123');
    });
  });
});
