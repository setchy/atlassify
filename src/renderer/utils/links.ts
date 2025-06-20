import type { Account, AtlassifyNotification, Link } from '../types';
import { openExternalLink } from './comms';
import { Constants } from './constants';

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
        'https://id.atlassian.com/manage-profile/security/api-tokens' as Link,
    },
  },
};

export function openAtlassifyReleaseNotes(version: string) {
  openExternalLink(
    `https://github.com/${Constants.REPO_SLUG}/releases/tag/${version}` as Link,
  );
}

export function openAtlassianSecurityDocs() {
  const url = new URL(URLs.ATLASSIAN.DOCS.API_TOKEN);
  openExternalLink(url.toString() as Link);
}

export function openAtlassianCreateToken() {
  const url = new URL(URLs.ATLASSIAN.WEB.SECURITY_TOKENS);
  openExternalLink(url.toString() as Link);
}

export function openMyNotifications() {
  const url = new URL(URLs.ATLASSIAN.WEB.MY_NOTIFICATIONS);
  openExternalLink(url.toString() as Link);
}

export function openMyPullRequests() {
  const url = new URL(URLs.ATLASSIAN.WEB.BITBUCKET_HOME);
  openExternalLink(url.toString() as Link);
}

export function openAccountProfile(account: Account) {
  const url = new URL(`${URLs.ATLASSIAN.WEB.PEOPLE}/${account.id}`);
  openExternalLink(url.toString() as Link);
}

export async function openNotification(notification: AtlassifyNotification) {
  openExternalLink(notification.entity.url);
}
