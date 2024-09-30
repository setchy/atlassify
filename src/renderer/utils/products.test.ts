import type {
  AtlassianHeadNotification,
  AtlassianNotification,
} from './api/types';
import { PRODUCTS, getAtlassianProduct } from './products';

describe('renderer/utils/products.ts', () => {
  it('getAtlassianProduct - should map to correct products', () => {
    expect(
      getAtlassianProduct(createProductNotificationMock('bitbucket')),
    ).toBe(PRODUCTS.bitbucket);

    expect(getAtlassianProduct(createProductNotificationMock('compass'))).toBe(
      PRODUCTS.compass,
    );

    expect(
      getAtlassianProduct(createProductNotificationMock('confluence')),
    ).toBe(PRODUCTS.confluence);

    expect(
      getAtlassianProduct(createProductNotificationMock('jira', 'servicedesk')),
    ).toBe(PRODUCTS['jira service management']);

    expect(
      getAtlassianProduct(createProductNotificationMock('jira', 'software')),
    ).toBe(PRODUCTS.jira);

    expect(getAtlassianProduct(createProductNotificationMock('jira'))).toBe(
      PRODUCTS['jira product discovery'],
    );

    expect(
      getAtlassianProduct(createProductNotificationMock('team-central')),
    ).toBe(PRODUCTS['team central (atlas)']);

    expect(
      getAtlassianProduct(createProductNotificationMock('unmapped', 'product')),
    ).toBe(PRODUCTS.unknown);
  });
});

function createProductNotificationMock(
  registrationProduct: string,
  subProduct?: string,
): AtlassianNotification {
  const mockHeadNotification: Partial<AtlassianHeadNotification> = {
    analyticsAttributes: [
      {
        key: 'registrationProduct',
        value: registrationProduct,
      },
      {
        key: 'subProduct',
        value: subProduct,
      },
    ],
  };

  const mockAtlassianNotification: Partial<AtlassianNotification> = {
    headNotification: mockHeadNotification as AtlassianHeadNotification,
  };

  return mockAtlassianNotification as AtlassianNotification;
}
