import { BitbucketIcon } from '@atlaskit/logo';
import { mockAtlassianCloudAccount } from '../../../__mocks__/state-mocks';
import type { AtlasifyNotification, Link } from '../../../types';
import type { Repository } from '../types';

export const mockAtlasifyNotification: AtlasifyNotification[] = [
  {
    account: mockAtlassianCloudAccount,
    id: '138661096',
    unread: true,
    updated_at: '2017-05-20T17:51:57Z',
    last_read_at: '2017-05-20T17:06:51Z',
    subject: {
      title: 'I am a robot and this is a test!',
      url: 'https://api.github.com/repos/atlasify-app/notifications-test/issues/1' as Link,
      latest_comment_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/issues/comments/302888448' as Link,
      user: {
        login: 'gitify-app',
        html_url: 'https://github.com/atlasify-app' as Link,
        avatar_url:
          'https://avatars.githubusercontent.com/u/133795385?s=200&v=4' as Link,
        type: 'User',
      },
    },
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
    category: 'direct',
    readState: 'unread',
    repository: {
      id: 57216596,
      node_id: 'MDEwOlJlcG9zaXRvcnkzNjAyOTcwNg==',
      name: 'notifications-test',
      full_name: 'atlasify-app/notifications-test',
      url: 'https://api.github.com/atlasify-app/notifications-test' as Link,
      owner: {
        login: 'gitify-app',
        id: 6333409,
        node_id: 'MDQ6VXNlcjYzMzM0MDk=',
        avatar_url:
          'https://avatars.githubusercontent.com/u/133795385?s=200&v=4' as Link,
        gravatar_id: '',
        url: 'https://api.github.com/users/gitify-app' as Link,
        html_url: 'https://github.com/gitify-app' as Link,
        followers_url:
          'https://api.github.com/users/atlasify-app/followers' as Link,
        following_url:
          'https://api.github.com/users/atlasify-app/following{/other_user}' as Link,
        gists_url:
          'https://api.github.com/users/atlasify-app/gists{/gist_id}' as Link,
        starred_url:
          'https://api.github.com/users/atlasify-app/starred{/owner}{/repo}' as Link,
        subscriptions_url:
          'https://api.github.com/users/atlasify-app/subscriptions' as Link,
        organizations_url:
          'https://api.github.com/users/atlasify-app/orgs' as Link,
        repos_url: 'https://api.github.com/users/atlasify-app/repos' as Link,
        events_url:
          'https://api.github.com/users/atlasify-app/events{/privacy}' as Link,
        received_events_url:
          'https://api.github.com/users/atlasify-app/received_events' as Link,
        type: 'User',
        site_admin: false,
      },
      private: true,
      description: 'Test Repository',
      fork: false,
      archive_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/{archive_format}{/ref}' as Link,
      assignees_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/assignees{/user}' as Link,
      blobs_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/git/blobs{/sha}' as Link,
      branches_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/branches{/branch}' as Link,
      collaborators_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/collaborators{/collaborator}' as Link,
      comments_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/comments{/number}' as Link,
      commits_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/commits{/sha}' as Link,
      compare_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/compare/{base}...{head}' as Link,
      contents_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/contents/{+path}' as Link,
      contributors_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/contributors' as Link,
      deployments_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/deployments' as Link,
      downloads_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/downloads' as Link,
      events_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/events' as Link,
      forks_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/forks' as Link,
      git_commits_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/git/commits{/sha}' as Link,
      git_refs_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/git/refs{/sha}' as Link,
      git_tags_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/git/tags{/sha}' as Link,
      hooks_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/hooks' as Link,
      html_url: 'https://github.com/atlasify-app/notifications-test' as Link,
      issue_comment_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/issues/comments{/number}' as Link,
      issue_events_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/issues/events{/number}' as Link,
      issues_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/issues{/number}' as Link,
      keys_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/keys{/key_id}' as Link,
      labels_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/labels{/name}' as Link,
      languages_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/languages' as Link,
      merges_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/merges' as Link,
      milestones_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/milestones{/number}' as Link,
      notifications_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/notifications{?since,all,participating}' as Link,
      pulls_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/pulls{/number}' as Link,
      releases_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/releases{/id}' as Link,
      stargazers_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/stargazers' as Link,
      statuses_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/statuses/{sha}' as Link,
      subscribers_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/subscribers' as Link,
      subscription_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/subscription' as Link,
      tags_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/tags' as Link,
      teams_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/teams' as Link,
      trees_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/git/trees{/sha}' as Link,
    },
    url: 'https://api.github.com/notifications/threads/138661096' as Link,
    subscription_url:
      'https://api.github.com/notifications/threads/138661096/subscription' as Link,
  },
  {
    id: '148827438',
    unread: true,
    updated_at: '2017-05-20T17:06:34Z',
    last_read_at: '2017-05-20T16:59:03Z',
    subject: {
      title: 'Improve the UI',
      url: 'https://api.github.com/repos/atlasify-app/notifications-test/issues/4' as Link,
      latest_comment_url:
        'https://api.github.com/repos/atlasify-app/notifications-test/issues/comments/302885965' as Link,
    },
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
    category: 'direct',
    readState: 'unread',
    account: mockAtlassianCloudAccount,
    repository: {
      id: 57216596,
      name: 'notifications-test',
      full_name: 'atlasify-app/notifications-test',
      owner: {
        login: 'gitify-app',
        id: 6333409,
        avatar_url:
          'https://avatars.githubusercontent.com/u/133795385?s=200&v=4' as Link,
        gravatar_id: '',
        url: 'https://api.github.com/users/gitify-app' as Link,
        html_url: 'https://github.com/gitify-app' as Link,
        followers_url:
          'https://api.github.com/users/atlasify-app/followers' as Link,
        following_url:
          'https://api.github.com/users/atlasify-app/following{/other_user}' as Link,
        gists_url:
          'https://api.github.com/users/atlasify-app/gists{/gist_id}' as Link,
        starred_url:
          'https://api.github.com/users/atlasify-app/starred{/owner}{/repo}' as Link,
        subscriptions_url:
          'https://api.github.com/users/atlasify-app/subscriptions' as Link,
        organizations_url:
          'https://api.github.com/users/atlasify-app/orgs' as Link,
        repos_url: 'https://api.github.com/users/atlasify-app/repos' as Link,
        events_url:
          'https://api.github.com/users/atlasify-app/events{/privacy}' as Link,
        received_events_url:
          'https://api.github.com/users/atlasify-app/received_events' as Link,
        type: 'User',
        site_admin: false,
      },
      private: true,
      html_url: 'https://github.com/atlasify-app/notifications-test',
      description: null,
      fork: false,
      // Removed the rest of the properties
    } as unknown as Repository,
    url: 'https://api.github.com/notifications/threads/148827438' as Link,
    subscription_url:
      'https://api.github.com/notifications/threads/148827438/subscription' as Link,
  },
];

export const mockSingleNotification: AtlasifyNotification =
  mockAtlasifyNotification[0];
