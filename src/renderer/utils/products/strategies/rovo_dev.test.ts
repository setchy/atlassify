import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification, Link } from '../../../types';

import { PRODUCTS } from '../index';
import { getProductStrategy } from './index';

describe('renderer/utils/products/strategies/rovo_dev', () => {
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

  it('actorType returns automation for rovo dev notifications', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product: PRODUCTS.rovo_dev,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification).actorType(notification)).toBe(
      'automation',
    );  
  });
});
