import { BitbucketIcon } from '@atlaskit/logo';
import { mockAtlassianCloudAccount } from '../../../__mocks__/state-mocks';
import type { AtlasifyNotification, Link } from '../../../types';

export const mockAtlasifyNotification: AtlasifyNotification[] = [
  {
    account: mockAtlassianCloudAccount,
    id: '138661096',
    title: 'I am a robot and this is a test!',
    unread: true,
    updated_at: '2024-09-13T21:12:16.662Z',
    entity: {
      title: 'Repository',
      iconUrl: 'https://github.atlasify.io/favicon.ico' as Link,
      url: 'https://github.atlasify.io/myorg/notifications-test' as Link,
    },
    path: {
      title: 'Repository',
      iconUrl: 'https://github.atlasify.io/favicon.ico' as Link,
      url: 'https://github.atlasify.io/myorg/notifications-test' as Link,
    },
    product: {
      name: 'bitbucket',
      icon: BitbucketIcon,
    },
    actor: {
      displayName: 'atlasify-app',
      avatarURL:
        'https://avatars.githubusercontent.com/u/133795385?s=200&v=4' as Link,
    },
    category: 'direct',
    readState: 'unread',
    url: 'https://api.github.com/notifications/threads/138661096' as Link,
  },
  {
    id: '148827438',
    title: 'I am a robot and this is a test!',
    unread: true,
    updated_at: '2024-09-13T21:12:16.662Z',
    entity: {
      title: 'Repository',
      iconUrl: 'https://github.atlasify.io/favicon.ico' as Link,
      url: 'https://github.atlasify.io/myorg/notifications-test' as Link,
    },
    path: {
      title: 'Repository',
      iconUrl: 'https://github.atlasify.io/favicon.ico' as Link,
      url: 'https://github.atlasify.io/myorg/notifications-test' as Link,
    },
    product: {
      name: 'bitbucket',
      icon: BitbucketIcon,
    },
    actor: {
      displayName: 'atlasify-app',
      avatarURL:
        'https://avatars.githubusercontent.com/u/133795385?s=200&v=4' as Link,
    },
    category: 'direct',
    readState: 'unread',
    account: mockAtlassianCloudAccount,
    url: 'https://api.github.com/notifications/threads/148827438' as Link,
  },
];

export const mockSingleNotification: AtlasifyNotification =
  mockAtlasifyNotification[0];
