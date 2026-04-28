import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { PRODUCTS } from '../index';
import { bitbucketStrategy } from './bitbucket';
import { compassStrategy } from './compass';
import { defaultStrategy } from './default';
import { homeStrategy } from './home';
import { getProductStrategy } from './index';
import { rovoStrategy } from './rovo';
import { rovoDevStrategy } from './rovo_dev';

describe('renderer/utils/products/strategies/index', () => {
  describe('returns default strategy', () => {
    it.each([
      { productKey: 'confluence' as const },
      { productKey: 'jira' as const },
      { productKey: 'jira_product_discovery' as const },
      { productKey: 'jira_service_management' as const },
      { productKey: 'teams' as const },
      { productKey: 'unknown' as const },
    ])('for $productKey', ({ productKey }) => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS[productKey],
      } as AtlassifyNotification;

      expect(getProductStrategy(notification)).toBe(defaultStrategy);
    });
  });

  describe('returns custom strategy', () => {
    it.each([
      { productKey: 'bitbucket' as const, expectedStrategy: bitbucketStrategy },
      { productKey: 'compass' as const, expectedStrategy: compassStrategy },
      { productKey: 'home' as const, expectedStrategy: homeStrategy },
      { productKey: 'rovo' as const, expectedStrategy: rovoStrategy },
      { productKey: 'rovo_dev' as const, expectedStrategy: rovoDevStrategy },
    ])('for $productKey', ({ productKey, expectedStrategy }) => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS[productKey],
      } as AtlassifyNotification;

      expect(getProductStrategy(notification)).toBe(expectedStrategy);
    });
  });
});
