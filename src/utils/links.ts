import type { Account, Link } from '../types';
import type { Notification, Repository, SubjectUser } from './api/typesGitHub';
import { openExternalLink } from './comms';
import { Constants } from './constants';
import { generateGitHubWebUrl } from './helpers';

export function openGitifyRepository() {
  openExternalLink(`https://github.com/${Constants.REPO_SLUG}` as Link);
}

export function openGitifyReleaseNotes(version: string) {
  openExternalLink(
    `https://github.com/${Constants.REPO_SLUG}/releases/tag/${version}` as Link,
  );
}

export function openMyNotifications() {
  const url = new URL(Constants.ATLASSIAN_WEB.MY_NOTIFICATIONS);
  openExternalLink(url.toString() as Link);
}

export function openMyIssues() {
  const url = new URL(Constants.ATLASSIAN_WEB.MY_NOTIFICATIONS);
  openExternalLink(url.toString() as Link);
}

export function openMyPullRequests() {
  const url = new URL(Constants.ATLASSIAN_WEB.MY_NOTIFICATIONS);
  openExternalLink(url.toString() as Link);
}

export function openAccountProfile(account: Account) {
  const url = new URL(`https://team.atlassian.com/people/${account.user.id}`);
  openExternalLink(url.toString() as Link);
}

export function openUserProfile(user: SubjectUser) {
  openExternalLink(user.html_url);
}

export function openRepository(repository: Repository) {
  openExternalLink(repository.html_url);
}

export async function openNotification(notification: Notification) {
  const url = await generateGitHubWebUrl(notification);
  openExternalLink(url);
}
