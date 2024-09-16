import type { Account, AtlasifyNotification, Link } from '../types';
import { openExternalLink } from './comms';
import { Constants } from './constants';

export function openAtlasifyRepository() {
  openExternalLink(`https://github.com/${Constants.REPO_SLUG}` as Link);
}

export function openAtlasifyReleaseNotes(version: string) {
  openExternalLink(
    `https://github.com/${Constants.REPO_SLUG}/releases/tag/${version}` as Link,
  );
}

export function openAtlassianSecurityDocs() {
  const url = new URL(Constants.ATLASSIAN_URLS.DOCS.API_TOKEN_URL);
  openExternalLink(url.toString() as Link);
}

export function openAtlassianCreateToken() {
  const url = new URL(Constants.ATLASSIAN_URLS.WEB.SECURITY_TOKENS);
  openExternalLink(url.toString() as Link);
}

export function openMyNotifications() {
  const url = new URL(Constants.ATLASSIAN_URLS.WEB.MY_NOTIFICATIONS);
  openExternalLink(url.toString() as Link);
}

export function openMyPullRequests() {
  const url = new URL(Constants.ATLASSIAN_URLS.WEB.BITBUCKET_HOME);
  openExternalLink(url.toString() as Link);
}

export function openAccountProfile(account: Account) {
  const url = new URL(
    `${Constants.ATLASSIAN_URLS.WEB.PEOPLE}/${account.user.id}`,
  );
  openExternalLink(url.toString() as Link);
}

export async function openNotification(notification: AtlasifyNotification) {
  openExternalLink(notification.entity.url);
}
