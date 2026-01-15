import type {
  AccountNotifications,
  AtlassifyNotification,
  Link,
  ProductType,
} from '../types';

import { PRODUCTS } from '../utils/products';
import { mockAtlassianCloudAccount } from './account-mocks';

export const mockAtlassifyNotifications: AtlassifyNotification[] = [
  {
    id: '138661096',
    order: 0,
    notificationGroup: {
      id: '138661096',
      size: 1,
      additionalActors: [],
    },
    message: '#103: chore(deps): update dependency eslint',
    updated_at: '2020-09-13T21:12:16.662Z',
    entity: {
      title: '#103: chore(deps): update dependency eslint',
      iconUrl:
        'https://bbc-object-storage--frontbucket.us-east-1.prod.public.atl-paas.net/80907f89f58b/img/favicon.ico' as Link,
      url: 'https://bitbucket.org/myorg/notifications-test/pull-requests/103?link_source=platform' as Link,
    },
    path: null,
    product: PRODUCTS.bitbucket,
    actor: {
      displayName: 'atlassify-app',
      avatarURL:
        'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/123' as Link,
    },
    category: 'direct',
    readState: 'unread',
    account: mockAtlassianCloudAccount,
    url: 'https://bitbucket.org/myorg/notifications-test/pull-requests/103?link_source=platform' as Link,
    type: 'unknown',
  },
  {
    id: '148827438',
    order: 1,
    notificationGroup: {
      id: '138661096',
      size: 2,
      additionalActors: [
        {
          displayName: 'atlassify-app',
          avatarURL:
            'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/123' as Link,
        },
      ],
    },
    message: 'atlassify-app edited your page',
    updated_at: '2020-09-13T21:12:16.662Z',
    entity: {
      title: 'Atlassify Home',
      iconUrl:
        'https://home-static.us-east-1.prod.public.atl-paas.net/confluence-page-icon.svg' as Link,
      url: 'https://some-tenant.atlassian.net/wiki/spaces/Atlassify/pages/3752329340/Atlassify+Home' as Link,
    },
    path: {
      title: 'Atlassify Space',
      iconUrl: null,
      url: 'https://some-tenant.atlassian.net/wiki/spaces/Atlassify' as Link,
    },
    product: PRODUCTS.confluence,
    actor: {
      displayName: 'atlassify-app',
      avatarURL:
        'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/123' as Link,
    },
    category: 'direct',
    readState: 'unread',
    account: mockAtlassianCloudAccount,
    url: 'https://some-tenant.atlassian.net/wiki/spaces/Atlassify/pages/3752329340/Atlassify+Home' as Link,
    type: 'Create',
  },
];

export const mockSingleAtlassifyNotification: AtlassifyNotification =
  mockAtlassifyNotifications[0];

export const mockAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: mockAtlassifyNotifications,
    hasMoreNotifications: false,
    error: null,
  },
];

export const mockAccountNotificationsWithMorePages: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: mockAtlassifyNotifications,
    hasMoreNotifications: true,
    error: null,
  },
];

export const mockSingleAccountNotifications: AccountNotifications[] = [
  {
    account: mockAtlassianCloudAccount,
    notifications: [mockAtlassifyNotifications[0]],
    hasMoreNotifications: false,
    error: null,
  },
];

export function createMockNotificationForProductType(
  id: string,
  productType: ProductType | null,
): AtlassifyNotification {
  return {
    id,
    account: mockAtlassianCloudAccount,
    product: {
      type: productType,
    },
  } as AtlassifyNotification;
}
