import type { Token, Username } from '../../../types';
import type { BitbucketYourWorkResponse } from './types';

import { performRESTRequestWithCredentials } from '../request';

const BITBUCKET_INTERNAL_API = 'https://api.bitbucket.org/internal';

const PR_FIELDS = [
  'id',
  'title',
  'draft',
  'comment_count',
  'task_count',
  'author.display_name',
  'author.links.avatar',
  'links',
  'destination.branch.name',
  'destination.repository.name',
  'destination.repository.full_name',
  'reviewers.display_name',
  'reviewers.links.avatar',
  'extra.commit_statuses',
  'extra.last_comment',
  'extra.state',
  'created_on',
  'updated_on',
  'state',
];

const PR_GROUPS = ['reviewing', 'authored', 'closed'] as const;

const YOUR_WORK_FIELDS = PR_GROUPS.flatMap((group) =>
  PR_FIELDS.map((field) => `pullRequests.${group}.${field}`),
).join(',');

/**
 * Fetch the Bitbucket "Your Work" overview for a given workspace.
 *
 * Returns open PRs the authenticated user authored or is reviewing.
 *
 * @param username - The Bitbucket username for Basic Auth.
 * @param token - The decrypted Bitbucket app password.
 * @param workspace - The Bitbucket workspace slug.
 * @returns Promise resolving to the workspace overview response.
 */
export function getBitbucketWorkspaceYourWork(
  username: Username,
  token: Token,
  workspace: string,
): Promise<BitbucketYourWorkResponse> {
  const url = `${BITBUCKET_INTERNAL_API}/workspaces/${encodeURIComponent(workspace)}/overview-view-state?fields=${YOUR_WORK_FIELDS}`;
  return performRESTRequestWithCredentials<BitbucketYourWorkResponse>(
    url,
    username,
    token,
  );
}
