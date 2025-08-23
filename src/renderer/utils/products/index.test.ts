import { mockAtlassianCloudAccount } from '../../__mocks__/state-mocks';
import type { AtlassianHeadNotificationFragment } from '../api/graphql/generated/graphql';
import { inferAtlassianProduct, PRODUCTS } from '.';

describe('renderer/utils/products/index.ts', () => {
  it('inferAtlassianProduct - should map to correct products from analytics attributes', async () => {
    expect(
      await inferAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('bitbucket'),
      ),
    ).toBe(PRODUCTS.bitbucket);

    expect(
      await inferAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('compass'),
      ),
    ).toBe(PRODUCTS.compass);

    expect(
      await inferAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('confluence'),
      ),
    ).toBe(PRODUCTS.confluence);

    expect(
      await inferAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('jira', 'servicedesk'),
      ),
    ).toBe(PRODUCTS.jira_service_management);

    expect(
      await inferAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('jira', 'core'),
      ),
    ).toBe(PRODUCTS.jira);

    expect(
      await inferAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('jira', 'software'),
      ),
    ).toBe(PRODUCTS.jira);

    expect(
      await inferAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('opsgenie'),
      ),
    ).toBe(PRODUCTS.jira_service_management);

    expect(
      await inferAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('people-and-teams-collective'),
      ),
    ).toBe(PRODUCTS.teams);

    expect(
      await inferAtlassianProduct(
        mockAtlassianCloudAccount,
        createProductNotificationMock('team-central'),
      ),
    ).toBe(PRODUCTS.home);

    expect(
      await inferAtlassianProduct(
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
