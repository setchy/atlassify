import { mockAtlassianCloudAccount } from '../../__mocks__/state-mocks';
import type { AtlassianHeadNotificationFragment } from '../api/graphql/generated/graphql';
import { inferAtlassianProduct, PRODUCTS } from '.';

describe('renderer/utils/products/index.ts', () => {
  describe('inferAtlassianProduct - should map to correct products from analytics attributes', async () => {
    it('bitbucket', async () => {
      expect(
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          createProductNotificationMock('bitbucket'),
        ),
      ).toBe(PRODUCTS.bitbucket);
    });

    it('compass', async () => {
      expect(
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          createProductNotificationMock('compass'),
        ),
      ).toBe(PRODUCTS.compass);
    });

    it('confluence', async () => {
      expect(
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          createProductNotificationMock('confluence'),
        ),
      ).toBe(PRODUCTS.confluence);
    });

    describe('jira', async () => {
      it('jira - core', async () => {
        expect(
          await inferAtlassianProduct(
            mockAtlassianCloudAccount,
            createProductNotificationMock('jira', 'core'),
          ),
        ).toBe(PRODUCTS.jira);
      });

      it('jira - software', async () => {
        expect(
          await inferAtlassianProduct(
            mockAtlassianCloudAccount,
            createProductNotificationMock('jira', 'software'),
          ),
        ).toBe(PRODUCTS.jira);
      });
    });

    it('jira - servicedesk', async () => {
      expect(
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          createProductNotificationMock('jira', 'servicedesk'),
        ),
      ).toBe(PRODUCTS.jira_service_management);
    });

    it('opsgenie', async () => {
      expect(
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          createProductNotificationMock('opsgenie'),
        ),
      ).toBe(PRODUCTS.jira_service_management);
    });

    it('teams', async () => {
      expect(
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          createProductNotificationMock('people-and-teams-collective'),
        ),
      ).toBe(PRODUCTS.teams);
    });

    it('home', async () => {
      expect(
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          createProductNotificationMock('team-central'),
        ),
      ).toBe(PRODUCTS.home);
    });

    it('unknown', async () => {
      expect(
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          createProductNotificationMock('unmapped', 'product'),
        ),
      ).toBe(PRODUCTS.unknown);
    });
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
