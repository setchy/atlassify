import { mockAtlassianCloudAccount } from '../__mocks__/state-mocks';
import type { AtlassianHeadNotificationFragment } from './api/graphql/generated/graphql';
import { getAtlassianProduct, PRODUCTS } from './products';

describe('renderer/utils/products.ts', () => {
  it('getAtlassianProduct - should map to correct products from analytics attributes', async () => {
    expect(
      await getAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('bitbucket'),
      ),
    ).toBe(PRODUCTS.bitbucket);

    expect(
      await getAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('compass'),
      ),
    ).toBe(PRODUCTS.compass);

    expect(
      await getAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('confluence'),
      ),
    ).toBe(PRODUCTS.confluence);

    expect(
      await getAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('jira', 'servicedesk'),
      ),
    ).toBe(PRODUCTS['jira service management']);

    expect(
      await getAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('jira', 'core'),
      ),
    ).toBe(PRODUCTS.jira);

    expect(
      await getAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('jira', 'software'),
      ),
    ).toBe(PRODUCTS.jira);

    // expect(
    //   await getAtlassianProduct(
    //     mockAtlassianCloudAccount,
    //     createProductNotificationMock('jira'),
    //   ),
    // ).toBe(PRODUCTS['jira product discovery']);

    expect(
      await getAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('opsgenie'),
      ),
    ).toBe(PRODUCTS['jira service management']);

    expect(
      await getAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('team-central'),
      ),
    ).toBe(PRODUCTS.home);

    expect(
      await getAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('unmapped', 'product'),
      ),
    ).toBe(PRODUCTS.unknown);
  });
});

function createProductNotificationMock(
  registrationProduct: string,
  subProduct?: string,
): AtlassianHeadNotificationFragment {
  const mockHeadNotification: Partial<AtlassianHeadNotificationFragment> = {
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

  return mockHeadNotification as AtlassianHeadNotificationFragment;
}
