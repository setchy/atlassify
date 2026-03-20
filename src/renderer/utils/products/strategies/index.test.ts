import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { PRODUCTS } from '../index';
import { defaultStrategy } from './default';
import { getProductStrategy } from './index';

describe('renderer/utils/products/strategies/index', () => {
  it('returns defaultStrategy for confluence', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product: PRODUCTS.confluence,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification)).toBe(defaultStrategy);
  });

  it('returns defaultStrategy for jira', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product: PRODUCTS.jira,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification)).toBe(defaultStrategy);
  });

  it('returns defaultStrategy for jira_product_discovery', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product: PRODUCTS.jira_product_discovery,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification)).toBe(defaultStrategy);
  });

  it('returns defaultStrategy for jira_service_management', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product: PRODUCTS.jira_service_management,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification)).toBe(defaultStrategy);
  });

  it('returns defaultStrategy for teams', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product: PRODUCTS.teams,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification)).toBe(defaultStrategy);
  });

  it('returns defaultStrategy for unknown', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product: PRODUCTS.unknown,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification)).toBe(defaultStrategy);
  });
});
