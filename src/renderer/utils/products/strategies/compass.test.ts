import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { PRODUCTS } from '../index';
import { compassStrategy } from './compass';
import { defaultStrategy } from './default';
import { getProductStrategy } from './index';

describe('renderer/utils/products/strategies/compass', () => {
  describe('avatarAppearance', () => {
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

    it('avatarAppearance returns circle for non-scorecard notifications', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'John commented on your PR',
      } as AtlassifyNotification;

      expect(
        getProductStrategy(notification).avatarAppearance(notification),
      ).toBe('circle');
    });
  });

  describe('actorType', () => {
    it('actorType returns automation for scorecard notifications', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'some-component is failing a scorecard',
      } as AtlassifyNotification;

      expect(
        getProductStrategy(notification).actorType(notification),
      ).toBe('automation');
    });

    it('actorType falls back to default strategy for non-scorecard notifications', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'John commented on your PR',
      } as AtlassifyNotification;

      expect(
        getProductStrategy(notification).actorType(notification),
      ).toBe(defaultStrategy.actorType(notification));
    });
  });

  it('is distinct from defaultStrategy', () => {
    expect(compassStrategy).not.toBe(defaultStrategy);
  });
});
