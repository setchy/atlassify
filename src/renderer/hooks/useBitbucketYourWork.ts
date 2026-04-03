import { useQuery } from '@tanstack/react-query';

import { Constants } from '../constants';

import { useSettingsStore } from '../stores';

import type { Token, Username } from '../types';
import type { BitbucketWorkItem } from '../utils/api/bitbucket/types';

import { getBitbucketWorkspaceYourWork } from '../utils/api/bitbucket/client';
import { bitbucketYourWorkKeys } from '../utils/api/queryKeys';
import { decryptValue } from '../utils/system/comms';

export interface UseBitbucketYourWorkResult {
  isLoading: boolean;
  isFetching: boolean;
  items: BitbucketWorkItem[];
  error: Error | null;
}

/**
 * Fetches and aggregates Bitbucket "Your Work" PR data across all accounts
 * and configured workspaces.
 *
 * Items are deduplicated by PR id (authored role takes precedence over reviewer)
 * and sorted by updated_on descending.
 */
export function useBitbucketYourWork(): UseBitbucketYourWorkResult {
  const bitbucketUsername = useSettingsStore((s) => s.bitbucketUsername);
  const bitbucketToken = useSettingsStore((s) => s.bitbucketToken);
  const bitbucketWorkspaces = useSettingsStore((s) => s.bitbucketWorkspaces);

  const {
    data: items = [],
    isLoading,
    isFetching,
    error,
  } = useQuery<BitbucketWorkItem[], Error>({
    queryKey: bitbucketYourWorkKeys.list(
      bitbucketUsername,
      bitbucketWorkspaces,
    ),
    queryFn: async () => {
      const results: BitbucketWorkItem[] = [];

      const decryptedToken = (await decryptValue(bitbucketToken)) as Token;
      const username = bitbucketUsername as Username;

      for (const workspace of bitbucketWorkspaces) {
        try {
          const response = await getBitbucketWorkspaceYourWork(
            username,
            decryptedToken,
            workspace,
          );

          const reviewing = (response.pullRequests?.reviewing ?? []).map(
            (pr) => ({ ...pr, role: 'REVIEWER' as const, workspace }),
          );
          const authored = (response.pullRequests?.authored ?? []).map(
            (pr) => ({ ...pr, role: 'AUTHOR' as const, workspace }),
          );
          const closed = (response.pullRequests?.closed ?? []).map((pr) => ({
            ...pr,
            role: 'CLOSED' as const,
            workspace,
          }));

          results.push(...reviewing, ...authored, ...closed);
        } catch {
          // Skip failed workspace silently — other workspaces still render
        }
      }

      // Deduplicate by PR id; prefer AUTHOR > REVIEWER > CLOSED for the same PR
      const ROLE_PRIORITY = { AUTHOR: 2, REVIEWER: 1, CLOSED: 0 };
      const seen = new Map<number, BitbucketWorkItem>();
      for (const item of results) {
        const existing = seen.get(item.id);
        if (
          !existing ||
          ROLE_PRIORITY[item.role] > ROLE_PRIORITY[existing.role]
        ) {
          seen.set(item.id, item);
        }
      }

      return [...seen.values()].sort(
        (a, b) =>
          new Date(b.extra?.last_comment ?? 0).getTime() -
          new Date(a.extra?.last_comment ?? 0).getTime(),
      );
    },
    enabled:
      bitbucketWorkspaces.length > 0 && !!bitbucketUsername && !!bitbucketToken,
    staleTime: Constants.QUERY_STALE_TIME_MS,
    gcTime: Constants.QUERY_GC_TIME_MS,
  });

  return { isLoading, isFetching, items, error: error ?? null };
}
