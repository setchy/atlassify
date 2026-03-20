import {
  mockAtlassifyNotifications,
  mockSingleAtlassifyNotification,
} from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification, Link } from '../../../types';

import { PRODUCTS } from '../index';
import { bitbucketStrategy, extractRepositoryName } from './bitbucket';
import { compassStrategy } from './compass';
import { defaultStrategy } from './default';
import { extractGoalOrProjectKey } from './home';
import { getProductStrategy } from './index';
import { extractRovoDevContextName, rovoDevStrategy } from './rovo_dev';

describe('renderer/utils/products/strategies', () => {
  describe('defaultStrategy', () => {
    it('bodyText returns entity title', () => {
      expect(defaultStrategy.bodyText(mockSingleAtlassifyNotification)).toBe(
        mockSingleAtlassifyNotification.entity.title,
      );
    });

    it('footerText returns path title when path exists', () => {
      const notificationWithPath = mockAtlassifyNotifications[1];
      expect(defaultStrategy.footerText(notificationWithPath)).toBe(
        notificationWithPath.path.title,
      );
    });

    it('footerText returns product display when path is null', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        path: null,
      } as AtlassifyNotification;

      expect(defaultStrategy.footerText(notification)).toBe(
        mockSingleAtlassifyNotification.product.display,
      );
    });

    it('avatarAppearance returns circle', () => {
      expect(
        defaultStrategy.avatarAppearance(mockSingleAtlassifyNotification),
      ).toBe('circle');
    });

    it('isAutomationActor returns false', () => {
      expect(
        defaultStrategy.isAutomationActor(mockSingleAtlassifyNotification),
      ).toBe(false);
    });
  });

  describe('bitbucket strategy', () => {
    it('footerText returns owner/repo', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.bitbucket,
      } as AtlassifyNotification;

      expect(getProductStrategy(notification).footerText(notification)).toBe(
        'myorg/notifications-test',
      );
    });

    it('bitbucketStrategy is instanceof DefaultStrategy', () => {
      expect(bitbucketStrategy).toBeInstanceOf(
        (defaultStrategy as object).constructor,
      );
    });

    it('extractRepositoryName parses entity url correctly', () => {
      expect(extractRepositoryName(mockSingleAtlassifyNotification)).toBe(
        'myorg/notifications-test',
      );
    });
  });

  describe('compass strategy', () => {
    it('avatarAppearance returns square for scorecard notifications', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'some-component is failing a scorecard',
      } as AtlassifyNotification;

      expect(
        getProductStrategy(notification).avatarAppearance(notification),
      ).toBe('square');
    });

    it('avatarAppearance returns circle for non-scorecard compass notifications', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'John commented on your PR',
      } as AtlassifyNotification;

      expect(
        getProductStrategy(notification).avatarAppearance(notification),
      ).toBe('circle');
    });

    it('isAutomationActor returns true for scorecard notifications', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'some-component is failing a scorecard',
      } as AtlassifyNotification;

      expect(
        getProductStrategy(notification).isAutomationActor(notification),
      ).toBe(true);
    });

    it('isAutomationActor returns false for non-scorecard compass notifications', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'John commented on your component',
      } as AtlassifyNotification;

      expect(
        getProductStrategy(notification).isAutomationActor(notification),
      ).toBe(false);
    });

    it('compassStrategy is distinct from defaultStrategy', () => {
      expect(compassStrategy).not.toBe(defaultStrategy);
    });
  });

  describe('home strategy', () => {
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

  describe('rovo_dev strategy', () => {
    it('bodyText returns AI context string', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.rovo_dev,
        url: 'https://atlassify.atlassian.net/browse/ATLASSIFY-123?showAutodev=true' as Link,
      } as AtlassifyNotification;

      expect(getProductStrategy(notification).bodyText(notification)).toBe(
        'The AI coding tool has generated code for ATLASSIFY-123',
      );
    });

    it('isAutomationActor always returns true', () => {
      expect(
        getProductStrategy(mockSingleAtlassifyNotification).isAutomationActor(
          mockSingleAtlassifyNotification,
        ),
      ).toBe(false); // default strategy — bitbucket mock
    });

    it('rovoDevStrategy.isAutomationActor always returns true', () => {
      expect(rovoDevStrategy.isAutomationActor()).toBe(true);
    });

    it('extractRovoDevContextName parses branch from url', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        url: 'https://atlassify.atlassian.net/browse/ATLASSIFY-123?showAutodev=true' as Link,
      } as AtlassifyNotification;

      expect(extractRovoDevContextName(notification)).toBe(
        'The AI coding tool has generated code for ATLASSIFY-123',
      );
    });
  });

  describe('default strategy is used for remaining products', () => {
    for (const type of [
      'confluence',
      'jira',
      'jira_product_discovery',
      'jira_service_management',
      'teams',
      'unknown',
    ] as const) {
      it(`${type} resolves to defaultStrategy via getProductStrategy`, () => {
        const notification = {
          ...mockSingleAtlassifyNotification,
          product: PRODUCTS[type],
        } as AtlassifyNotification;

        expect(getProductStrategy(notification)).toBe(defaultStrategy);
      });
    }
  });
});
