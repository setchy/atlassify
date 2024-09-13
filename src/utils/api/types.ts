import type { Account, Link } from '../../types';

export interface AtlassianProduct {
  name: string;
  icon: React.ComponentType;
}

// Note: This is not in the official GitHub API. We add this to make notification interactions easier.
export interface GitifyNotification {
  account: Account;
}

export interface MyUserDetails {
  me: {
    user: {
      accountId: string;
      name: string;
      picture: Link;
    };
  };
}

export interface MyNotifications {
  notifications: {
    unseenNotificationCount: number;
    notificationFeed: {
      nodes: AtlassianNotification[];
    };
  };
}

export type Category = 'direct' | 'watching';

export type ReadState = 'unread' | 'read';

export type Product =
  | 'bitbucket'
  | 'confluence'
  | 'compass'
  | 'jira'
  | 'unknown';

export interface AtlassianNotification {
  groupId: string;
  headNotification: {
    notificationId: string;
    timestamp: string;
    readState: string;
    category: string;
    content: {
      type: string;
      message: string;
      url: Link;
      path: [
        {
          title: string;
          url: Link;
          iconUrl: Link | null;
        },
      ];
      entity: {
        title: string;
        iconUrl: Link;
        url: Link;
      };
      actor: {
        displayName: string;
        avatarURL: Link;
      };
    };
    analyticsAttributes: [
      {
        key: string;
        value: string;
      },
    ];
  };
}

export type UserDetails = User & UserProfile;

export interface UserProfile {
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: string;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: Plan;
}

export interface Plan {
  name: string;
  space: number;
  private_repos: number;
  collaborators: number;
}

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: Link;
  gravatar_url: Link;
  url: Link;
  html_url: Link;
  followers_url: Link;
  following_url: Link;
  gists_url: Link;
  starred_url: Link;
  subscriptions_url: Link;
  organizations_url: Link;
  repos_url: Link;
  events_url: Link;
  received_events_url: Link;
  type: UserType;
  site_admin: boolean;
}

export type UserType =
  | 'Bot'
  | 'EnterpriseUserAccount'
  | 'Mannequin'
  | 'Organization'
  | 'User';

export interface SubjectUser {
  login: string;
  html_url: Link;
  avatar_url: Link;
  type: UserType;
}

export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: Owner;
  html_url: Link;
  description: string;
  fork: boolean;
  url: Link;
  forks_url: Link;
  keys_url: Link;
  collaborators_url: Link;
  teams_url: Link;
  hooks_url: Link;
  issue_events_url: Link;
  events_url: Link;
  assignees_url: Link;
  branches_url: Link;
  tags_url: Link;
  blobs_url: Link;
  git_tags_url: Link;
  git_refs_url: Link;
  trees_url: Link;
  statuses_url: Link;
  languages_url: Link;
  stargazers_url: Link;
  contributors_url: Link;
  subscribers_url: Link;
  subscription_url: Link;
  commits_url: Link;
  git_commits_url: Link;
  comments_url: Link;
  issue_comment_url: Link;
  contents_url: Link;
  compare_url: Link;
  merges_url: Link;
  archive_url: Link;
  downloads_url: Link;
  issues_url: Link;
  pulls_url: Link;
  milestones_url: Link;
  notifications_url: Link;
  labels_url: Link;
  releases_url: Link;
  deployments_url: Link;
}

export interface Owner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: Link;
  gravatar_id: string;
  url: Link;
  html_url: Link;
  followers_url: Link;
  following_url: Link;
  gists_url: Link;
  starred_url: Link;
  subscriptions_url: Link;
  organizations_url: Link;
  repos_url: Link;
  events_url: Link;
  received_events_url: Link;
  type: string;
  site_admin: boolean;
}

export type Subject = GitHubSubject & GitifySubject;

interface GitHubSubject {
  title: string;
  url: Link | null;
  latest_comment_url: Link | null;
}

// This is not in the GitHub API, but we add it to the type to make it easier to work with
export interface GitifySubject {
  number?: number;
  user?: SubjectUser;
  linkedIssues?: string[];
  comments?: number;
  labels?: string[];
}

export interface GraphQLSearch<T> {
  data: {
    search: {
      nodes: T[];
    };
  };
}

export interface GraphQLResponse<T> {
  data: T;
}

export interface GitHubRESTError {
  message: string;
  documentation_url: Link;
}
