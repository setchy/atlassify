import { Constants } from '../../constants';

import type { AtlassianGraphQLResponse } from './types';

import { rendererLogWarn } from '../logger';

/**
 * Atlassian GraphQL response always returns true for Relay PageInfo `hasNextPage` even when there are no more pages.
 * Instead we can check the extensions response size to determine if there are more notifications.
 */
export function determineIfMorePagesAvailable<TResult>(
  res: AtlassianGraphQLResponse<TResult>,
): boolean {
  try {
    return (
      res.extensions.notifications.response_info.responseSize ===
      Constants.MAX_NOTIFICATIONS_PER_ACCOUNT
    );
  } catch (_err) {
    rendererLogWarn(
      'determineIfMorePagesAvailable',
      'Response did not contain extensions object, assuming no more pages',
    );
  }

  return false;
}
