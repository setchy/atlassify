import { mockSingleAtlassifyNotification } from '../../../__mocks__/notifications-mocks';

import type { AtlassifyNotification } from '../../../types';

import { PRODUCTS } from '../index';
import { bitbucketStrategy, extractRepositoryName } from './bitbucket';
import { defaultStrategy } from './default';
import { getProductStrategy } from './index';

describe('renderer/utils/products/strategies/bitbucket', () => {
  it('footerText returns owner/repo', () => {
    const notification = {
      ...mockSingleAtlassifyNotification,
      product: PRODUCTS.bitbucket,
    } as AtlassifyNotification;

    expect(getProductStrategy(notification).footerText(notification)).toBe(
      'myorg/notifications-test',
    );
  });

  describe('isAutomationActor', () => {
    it('isAutomationActor returns true for Rovo Dev actors', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.bitbucket,
        actor: {
          ...mockSingleAtlassifyNotification.actor,
          displayName: 'Rovo Dev',
        },
      } as AtlassifyNotification;

      expect(
        getProductStrategy(notification).isAutomationActor(notification),
      ).toBe(true);
    });

    it('isAutomationActor returns false for other display names', () => {
      const notification = {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.bitbucket,
        actor: {
          ...mockSingleAtlassifyNotification.actor,
          displayName: 'Not Rovo Dev',
        },
      } as AtlassifyNotification;

      expect(
        getProductStrategy(notification).isAutomationActor(notification),
      ).toBe(false);
    });
  });

  it('is instanceof DefaultStrategy', () => {
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
