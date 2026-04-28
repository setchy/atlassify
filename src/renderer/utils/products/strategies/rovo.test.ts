import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { PRODUCTS } from '../index';
import { defaultStrategy } from './default';
import { getProductStrategy } from './index';
import { rovoStrategy } from './rovo';

describe('renderer/utils/products/strategies/rovo', () => {
  describe('actorType', () => {
    it('actorType always returns rovo', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.rovo,
      } as AtlassifyNotification;

      expect(getProductStrategy(notification).actorType(notification)).toBe(
        'rovo',
      );
    });
  });

  it('is distinct from defaultStrategy', () => {
    expect(rovoStrategy).not.toBe(defaultStrategy);
  });
});
