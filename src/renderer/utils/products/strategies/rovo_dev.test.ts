import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification, Link } from '../../../types';

import { PRODUCTS } from '../index';
import { getProductStrategy } from './index';
import { extractRovoDevContextName, rovoDevStrategy } from './rovo_dev';

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

  it('isAutomationActor always returns true', () => {
    expect(rovoDevStrategy.isAutomationActor()).toBe(true);
  });

  it('extractRovoDevContextName parses context name from url', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      url: 'https://atlassify.atlassian.net/browse/ATLASSIFY-123?showAutodev=true' as Link,
    } as AtlassifyNotification;

    expect(extractRovoDevContextName(notification)).toBe(
      'The AI coding tool has generated code for ATLASSIFY-123',
    );
  });
});
