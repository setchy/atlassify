import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { PRODUCTS } from '../index';
import { compassStrategy } from './compass';
import { defaultStrategy } from './default';
import { getProductStrategy } from './index';

describe('renderer/utils/products/strategies/compass', () => {
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

  it('isAutomationActor returns false for non-scorecard notifications', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product: PRODUCTS.compass,
      message: 'John commented on your component',
    } as AtlassifyNotification;

    expect(
      getProductStrategy(notification).isAutomationActor(notification),
    ).toBe(false);
  });

  it('is distinct from defaultStrategy', () => {
    expect(compassStrategy).not.toBe(defaultStrategy);
  });
});
