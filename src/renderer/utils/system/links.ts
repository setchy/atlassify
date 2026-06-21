import { APPLICATION } from '../../../shared/constants';

import type { Account, AtlassifyNotification, Link } from '../../types';

import { openExternalLink, trackEvent } from './comms';

const SECURITY_TOKEN_SCOPES = [
  // 'read:assets:twg-cli',
  // 'read:board-scope.admin:jira-software',
  // 'read:3p-data:twg-cli',
  // 'read:board-scope:jira-software',
  // 'read:csm:twg-cli',
  // 'read:confluence:twg-cli',
  'read:account',
  // 'read:loom:twg-cli',
  // 'read:ops-alert:jira-service-management',
  // 'read:jira-align:twg-cli',
  // 'read:jsm:twg-cli',
  // 'read:goal:townsquare',
  // 'read:mercury:twg-cli',
  'read:jira-work',
  // 'read:jsw:twg-cli',
  'read:jira-user',
  // 'read:issue-details:jira',
  // 'read:project:jira',
  // 'read:project:townsquare',
  // 'read:sprint:jira-software',
  // 'read:trello:twg-cli',
  // 'read:radar:twg-cli',
  // 'read:teamwork-graph:twg-cli',
] as const;

const SECURITY_TOKEN_SELECTED_SCOPES = encodeURIComponent(
  JSON.stringify(SECURITY_TOKEN_SCOPES),
);

export const URLs = {
  ATLASSIAN: {
    API: 'https://team.atlassian.net/gateway/api/graphql' as Link,
    DOCS: {
      API_TOKEN:
        'https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token-with-scopes' as Link,
    },
    WEB: {
      BITBUCKET_HOME: 'https://bitbucket.org' as Link,
      MY_NOTIFICATIONS: 'https://team.atlassian.com/notifications' as Link,
      PEOPLE: 'https://team.atlassian.com/people' as Link,
      SECURITY_TOKENS:
        `https://id.atlassian.com/manage-profile/security/api-tokens?autofillToken=Atlassify&appId=twg&selectedScopes=${SECURITY_TOKEN_SELECTED_SCOPES}&expiryDays=365` as Link,
    },
  },
};

// 1. Actual implementations (private)
const _links = {
  openAtlassifyReleaseNotes(version: string) {
    openExternalLink(
      `https://github.com/${APPLICATION.REPO_SLUG}/releases/tag/${version}` as Link,
    );
  },

  openAtlassianSecurityDocs() {
    const url = new URL(URLs.ATLASSIAN.DOCS.API_TOKEN);
    openExternalLink(url.toString() as Link);
  },

  openAtlassianCreateToken() {
    const url = new URL(URLs.ATLASSIAN.WEB.SECURITY_TOKENS);
    openExternalLink(url.toString() as Link);
  },

  openMyNotifications() {
    const url = new URL(URLs.ATLASSIAN.WEB.MY_NOTIFICATIONS);
    openExternalLink(url.toString() as Link);
  },

  openMyPullRequests() {
    const url = new URL(URLs.ATLASSIAN.WEB.BITBUCKET_HOME);
    openExternalLink(url.toString() as Link);
  },

  openAccountProfile(account: Account) {
    const url = new URL(`${URLs.ATLASSIAN.WEB.PEOPLE}/${account.id}`);
    openExternalLink(url.toString() as Link);
  },

  async openNotification(notification: AtlassifyNotification) {
    openExternalLink(notification.entity.url ?? notification.url);
  },
};

// 2. Analytics wrapper
function withAnalytics<F extends (...args: unknown[]) => unknown>(
  fn: F,
  actionName: string,
): F {
  return ((...args: Parameters<F>): ReturnType<F> => {
    trackEvent('Action', { name: actionName });
    return fn(...args) as ReturnType<F>;
  }) as F;
}

// 3. Export wrapped functions
export const openAtlassifyReleaseNotes = withAnalytics(
  _links.openAtlassifyReleaseNotes,
  'Open Release Notes',
);

export const openAtlassianSecurityDocs = withAnalytics(
  _links.openAtlassianSecurityDocs,
  'Open Atlassian Security Docs',
);

export const openAtlassianCreateToken = withAnalytics(
  _links.openAtlassianCreateToken,
  'Open Atlassian Create Token',
);

export const openMyNotifications = withAnalytics(
  _links.openMyNotifications,
  'Open My Notifications',
);
export const openMyPullRequests = withAnalytics(
  _links.openMyPullRequests,
  'Open My Pull Requests',
);

export const openAccountProfile = withAnalytics(
  _links.openAccountProfile,
  'Open Account Profile',
);

export const openNotification = withAnalytics(
  _links.openNotification,
  'Open Notification',
);
