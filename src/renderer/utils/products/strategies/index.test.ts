import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { PRODUCTS } from '../index';
import { bitbucketStrategy } from './bitbucket';
import { compassStrategy } from './compass';
import { defaultStrategy } from './default';
import { homeStrategy } from './home';
import { getProductStrategy } from './index';
import { rovoChatStrategy } from './rovo_chat';
import { rovoDevStrategy } from './rovo_dev';

describe('renderer/utils/products/strategies/index', () => {
  const cases = [
    {
      product: PRODUCTS.bitbucket,
      strategy: bitbucketStrategy,
    },
    {
      product: PRODUCTS.compass,
      strategy: compassStrategy,
    },
    {
      product: PRODUCTS.home,
      strategy: homeStrategy,
    },
    {
      product: PRODUCTS.rovo_chat,
      strategy: rovoChatStrategy,
    },
    {
      product: PRODUCTS.rovo_dev,
      strategy: rovoDevStrategy,
    },
    {
      product: PRODUCTS.confluence,
      strategy: defaultStrategy,
    },
    {
      product: PRODUCTS.jira,
      strategy: defaultStrategy,
    },
    {
      product: PRODUCTS.jira_product_discovery,
      strategy: defaultStrategy,
    },
    {
      product: PRODUCTS.jira_service_management,
      strategy: defaultStrategy,
    },
    {
      product: PRODUCTS.teams,
      strategy: defaultStrategy,
    },
    {
      product: PRODUCTS.unknown,
      strategy: defaultStrategy,
    },
  ];

  it.each(cases)('maps $product.type to the correct strategy', ({ product, strategy }) => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification)).toBe(strategy);
  });
});
