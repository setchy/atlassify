import type { CloudID } from '../../types';

/**
 * Build the `collabContextRoutingAri` used to scope GraphQL requests to a specific Atlassian site.
 *
 * @param cloudId - The Atlassian tenant (site) cloud ID.
 * @returns The site-scoped collaboration context routing ARI, or `undefined` when no cloud ID is provided.
 */
export function getCollabContextRoutingAri(
  cloudId?: CloudID,
): string | undefined {
  return cloudId ? `ari:cloud:platform::site/${cloudId}` : undefined;
}
