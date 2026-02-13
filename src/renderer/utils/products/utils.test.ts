import { vi } from 'vitest';

const { getCloudIDsForHostnames, getJiraProjectTypeByKey } = vi.hoisted(() => ({
  getCloudIDsForHostnames: vi.fn(async () => ({
    data: { tenantContexts: [{ cloudId: 'cloud-1' }] },
  })),
  getJiraProjectTypeByKey: vi.fn(),
}));

vi.mock('../api/client', () => ({
  getCloudIDsForHostnames,
  getJiraProjectTypeByKey,
}));
vi.mock('../logger', () => ({
  rendererLogError: vi.fn(),
}));

import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';

import type { JiraProjectType } from '../api/types';

import type { AtlassianHeadNotificationFragment } from '../api/graphql/generated/graphql';
import { rendererLogError } from '../logger';
import {
  __resetProductInferenceCaches,
  inferAtlassianProduct,
  PRODUCTS,
} from '.';

// Access mocked API functions via hoisted references

describe('renderer/utils/products/utils.ts', () => {
  describe('inferAtlassianProduct', () => {
    test.each([
      ['bitbucket', PRODUCTS.bitbucket],
      ['compass', PRODUCTS.compass],
      ['confluence', PRODUCTS.confluence],
      ['opsgenie', PRODUCTS.jira_service_management],
      ['people-and-teams-collective', PRODUCTS.teams],
      ['team-central', PRODUCTS.home],
      ['unmapped', PRODUCTS.unknown],
    ])('%s maps correctly', async (registrationProduct, expected) => {
      expect(
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          createProductNotificationMock(registrationProduct),
        ),
      ).toBe(expected);
    });

    describe('jira analytics subProduct direct mapping', () => {
      test.each([
        ['core', PRODUCTS.jira],
        ['software', PRODUCTS.jira],
        ['servicedesk', PRODUCTS.jira_service_management],
      ])('jira + %s', async (sub, expected) => {
        expect(
          await inferAtlassianProduct(
            mockAtlassianCloudAccount,
            createProductNotificationMock('jira', sub),
          ),
        ).toBe(expected);
      });
    });

    describe('rovo dev product inference', () => {
      it('should infer rovo dev product', async () => {
        const mockNotification = {
          ...createProductNotificationMock('post-office'),
          content: {
            message: 'AI generated code is ready',
          },
        } as AtlassianHeadNotificationFragment;

        const inferredProduct = await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          mockNotification,
        );
        expect(inferredProduct).toBe(PRODUCTS.rovo_dev);
      });

      it('should return unknown is unsure', async () => {
        const mockNotification = {
          ...createProductNotificationMock('post-office'),
          content: {
            message: 'some other message type',
          },
        } as AtlassianHeadNotificationFragment;

        const inferredProduct = await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          mockNotification,
        );
        expect(inferredProduct).toBe(PRODUCTS.unknown);
      });
    });

    describe('lookupJiraProjectType', () => {
      const host = 'somehost';
      const makeJiraNotif = (
        key: string,
        issue = 123,
      ): AtlassianHeadNotificationFragment =>
        ({
          ...createProductNotificationMock('jira'),
          content: {
            path: [
              {
                title: `${key}-${issue} Title`,
                url: `https://${host}.example.atlassian.net/browse/${key}-${issue}`,
              },
            ],
          },
        }) as AtlassianHeadNotificationFragment;

      const setProjectType = (t: JiraProjectType) =>
        (getJiraProjectTypeByKey as any).mockResolvedValueOnce(t);

      test.each<
        [JiraProjectType, string, (typeof PRODUCTS)[keyof typeof PRODUCTS]]
      >([
        ['product_discovery', 'PDD', PRODUCTS.jira_product_discovery],
        ['service_desk', 'SVC', PRODUCTS.jira_service_management],
        ['business', 'BUS', PRODUCTS.jira],
        ['customer_service', 'CS', PRODUCTS.jira],
        ['software', 'SW', PRODUCTS.jira],
      ])('project type %s maps', async (projType, key, expected) => {
        setProjectType(projType);
        const notif = makeJiraNotif(key);
        expect(
          await inferAtlassianProduct(mockAtlassianCloudAccount, notif),
        ).toBe(expected);
      });

      it('falls back to jira when empty path', async () => {
        const mockNotification = {
          ...createProductNotificationMock('jira'),
          content: { path: [] },
        } as AtlassianHeadNotificationFragment;
        expect(
          await inferAtlassianProduct(
            mockAtlassianCloudAccount,
            mockNotification,
          ),
        ).toBe(PRODUCTS.jira);
      });

      it('falls back to jira on invalid URL', async () => {
        const mockNotification = {
          ...createProductNotificationMock('jira'),
          content: { path: [{ title: 'ABC-1', url: 'not-a-valid-url' }] },
        } as unknown as AtlassianHeadNotificationFragment;
        expect(
          await inferAtlassianProduct(
            mockAtlassianCloudAccount,
            mockNotification,
          ),
        ).toBe(PRODUCTS.jira);
      });

      it('caches cloud id + project type lookups', async () => {
        setProjectType('software');
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          makeJiraNotif('AAA'),
        );
        // Second same key
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          makeJiraNotif('AAA'),
        );
        // Different key reuses cloud id but new project type fetch
        setProjectType('service_desk');
        await inferAtlassianProduct(
          mockAtlassianCloudAccount,
          makeJiraNotif('BBB'),
        );

        const cloudCalls = (getCloudIDsForHostnames as any).mock.calls;
        expect(cloudCalls.length).toBe(1);
        const projCalls = (getJiraProjectTypeByKey as any).mock.calls;
        // 1st key fetch + 2nd key fetch = 2
        expect(
          projCalls.filter((c) => ['AAA', 'BBB'].includes(c[2])).length,
        ).toBe(2);
      });

      it('logs and falls back when cloud id retrieval fails', async () => {
        __resetProductInferenceCaches();
        (getCloudIDsForHostnames as any).mockRejectedValueOnce(
          new Error('cloud boom'),
        );
        const notif = makeJiraNotif('ERR1');
        expect(
          await inferAtlassianProduct(mockAtlassianCloudAccount, notif),
        ).toBe(PRODUCTS.jira);
        expect(rendererLogError).toHaveBeenCalled();
      });

      it('logs and falls back when project type lookup fails', async () => {
        __resetProductInferenceCaches();
        (getCloudIDsForHostnames as any).mockResolvedValueOnce({
          data: { tenantContexts: [{ cloudId: 'cloud-2' }] },
        });
        (getJiraProjectTypeByKey as any).mockRejectedValueOnce(
          new Error('project boom'),
        );
        const notif = makeJiraNotif('ERR2');
        expect(
          await inferAtlassianProduct(mockAtlassianCloudAccount, notif),
        ).toBe(PRODUCTS.jira);
        expect(rendererLogError).toHaveBeenCalled();
      });
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

afterEach(() => {
  vi.clearAllMocks();
  __resetProductInferenceCaches();
});
