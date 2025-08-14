// import type { AtlassianHeadNotificationFragment } from './api/graphql/generated/graphql';

// import { getAtlassianProduct, PRODUCTS } from './products';

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
      getAtlassianProduct(createProductNotificationMock('jira', 'core')),
    ).toBe(PRODUCTS.jira);

    expect(
      getAtlassianProduct(createProductNotificationMock('jira', 'software')),
    ).toBe(PRODUCTS.jira);

    expect(getAtlassianProduct(createProductNotificationMock('jira'))).toBe(
      PRODUCTS['jira product discovery'],
    );

    expect(getAtlassianProduct(createProductNotificationMock('opsgenie'))).toBe(
      PRODUCTS['jira service management'],
    );

    expect(
      getAtlassianProduct(createProductNotificationMock('team-central')),
    ).toBe(PRODUCTS.home);

    expect(
      getAtlassianProduct(createProductNotificationMock('unmapped', 'product')),
    ).toBe(PRODUCTS.unknown);
  });
});

// function createProductNotificationMock(
//   registrationProduct: string,
//   subProduct?: string,
// ): AtlassianHeadNotificationFragment {
//   const mockHeadNotification: Partial<AtlassianHeadNotificationFragment> = {
//     analyticsAttributes: [
//       {
//         key: 'registrationProduct',
//         value: registrationProduct,
//       },
//       {
//         key: 'subProduct',
//         value: subProduct,
//       },
//     ],
//   };

//   return mockHeadNotification as AtlassianHeadNotificationFragment;
// }
