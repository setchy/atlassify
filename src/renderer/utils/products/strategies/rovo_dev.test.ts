import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification, Link } from '../../../types';

import { PRODUCTS } from '../index';
import { getProductStrategy } from './index';
import { extractRovoDevContextName, rovoDevStrategy } from './rovo_dev';

describe('renderer/utils/products/strategies/rovo_dev', () => {
  it('bodyText returns AI context string', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      message: 'Rovo Dev session is waiting for your input',
      product: PRODUCTS.rovo_dev,
      url: 'https://atlassify.atlassian.net/browse/ATLASSIFY-123?showAutodev=true' as Link,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification).bodyText(notification)).toBe(
      'Rovo Dev session is waiting for your input for ATLASSIFY-123',
    );
  });

  it('actorType always returns rovo', () => {
    expect(
      rovoDevStrategy.actorType({
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.rovo_dev,
      }),
    ).toBe('rovo');
  });

  it('extractRovoDevContextName parses context name from url', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      message: 'Rovo Dev session is waiting for your input',
      url: 'https://atlassify.atlassian.net/browse/ATLASSIFY-123?showAutodev=true' as Link,
    } as AtlassifyNotification;

    expect(extractRovoDevContextName(notification)).toBe(
      'Rovo Dev session is waiting for your input for ATLASSIFY-123',
    );
  });
});
