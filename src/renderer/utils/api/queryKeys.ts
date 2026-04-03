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
   * @param accountsLength - Number of accounts
   */
  list: (accountsLength: number) =>
    [...accountsKeys.all, accountsLength] as const,
};

/**
 * Query keys for Bitbucket "Your Work" view
 */
export const bitbucketYourWorkKeys = {
  /**
   * Base key for all Bitbucket Your Work queries
   */
  all: ['bitbucketYourWork'] as const,

  /**
   * Key for listing Your Work items with specific parameters
   * @param username - The Bitbucket username
   * @param workspaces - Configured Bitbucket workspace slugs
   */
  list: (username: string, workspaces: string[]) =>
    [...bitbucketYourWorkKeys.all, username, workspaces.join(',')] as const,
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
   * @param accountsLength - Number of accounts
   * @param fetchOnlyUnread - Whether to fetch only unread notifications
   * @param groupByTitle - Whether to group notifications by title
   */
  list: (
    accountsLength: number,
    fetchOnlyUnread: boolean,
    groupByTitle: boolean,
  ) =>
    [
      ...notificationsKeys.all,
      accountsLength,
      fetchOnlyUnread,
      groupByTitle,
    ] as const,
};
