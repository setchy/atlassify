/**
 * Centralized query key factory for TanStack Query.
 * This ensures consistent query keys across the application and makes
 * invalidation and cache management easier.
 *
 * Following TanStack Query best practices:
 * https://tanstack.com/query/latest/docs/framework/react/community/lukemorales-query-key-factory
 */

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
   * @param accountsLength - Number of accounts
   * @param fetchOnlyUnread - Whether to fetch only unread notifications
   */
  list: (accountsLength: number, fetchOnlyUnread: boolean) =>
    [...notificationsKeys.all, accountsLength, fetchOnlyUnread] as const,
};
