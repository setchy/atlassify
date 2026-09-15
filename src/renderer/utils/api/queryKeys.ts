/**
 * Centralized query key factory for TanStack Query.
 * This ensures consistent query keys across the application and makes
 * invalidation and cache management easier.
 *
 * Following TanStack Query best practices:
 * https://tanstack.com/query/latest/docs/framework/react/community/lukemorales-query-key-factory
 */

/**
 * Query keys for accounts
 */
export const accountsKeys = {
  /**
   * Base key for all account queries
   */
  all: ['accounts'] as const,

  /**
   * Key for listing accounts with specific parameters
   * @param accountIds - Ordered stable account identifiers
   */
  list: (accountIds: string[]) => [...accountsKeys.all, accountIds] as const,
};

/**
 * Query keys for notifications
 */
export const notificationsKeys = {
  /**
   * Base key for all notification queries
   */
  all: ['notifications'] as const,

  /**
   * Key for listing notifications with specific parameters
   * @param accountIds - Ordered stable account identifiers
   * @param fetchOnlyUnread - Whether to fetch only unread notifications
   * @param groupByTitle - Whether to group notifications by title
   */
  list: (
    accountIds: string[],
    fetchOnlyUnread: boolean,
    groupByTitle: boolean,
  ) =>
    [
      ...notificationsKeys.all,
      accountIds,
      fetchOnlyUnread,
      groupByTitle,
    ] as const,
};
