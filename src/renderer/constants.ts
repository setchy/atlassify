export const Constants = {
  // Local storage keys
  STORAGE: {
    ACCOUNTS: 'atlassify-accounts',
    FILTERS: 'atlassify-filters',
    SETTINGS: 'atlassify-settings',
    LANGUAGE: 'atlassify-language',
  },

  // Emojis for different states and events
  EMOJIS: {
    ALL_READ: ['🎉', '🎊', '🥳', '👏', '🙌', '😎', '🏖️', '🚀', '✨', '🏆'],
    LOADING: ['⏳', '⌛'],
    ERRORS: {
      BAD_CREDENTIALS: ['🔓'],
      BAD_REQUEST: ['😳'],
      NETWORK: ['🛜'],
      OFFLINE: ['🛜'],
      UNKNOWN: ['🤔', '🥲', '🫠', '🙃', '🙈'],
    },
  },

  // Fetch notifications interval in milliseconds, used by useNotifications hook
  FETCH_NOTIFICATIONS_INTERVAL_MS: 60 * 1000, // 1 minute

  // Fetch accounts interval in milliseconds, used by useAccounts hook
  REFRESH_ACCOUNTS_INTERVAL_MS: 60 * 60 * 1000, // 1 hour

  // Cooldown before retrying a failed query, used by TanStack Query client
  QUERY_RETRY_DELAY_MS: 30 * 1000, // 30 seconds

  // Query garbage collection time in milliseconds - how long unused cache data stays in memory
  QUERY_GC_TIME_MS: 10 * 60 * 1000, // 10 minutes

  // Maximum number of notifications returned per GraphQL request (API-enforced limit)
  NOTIFICATIONS_PAGE_SIZE: 100,

  // Maximum number of notifications to fetch per account, across paginated requests
  MAX_NOTIFICATIONS_PER_ACCOUNT: 999,

  // How long a notification may be absent from the feed before it is removed
  // when its unread state could not be verified. Absorbs intermittent API gaps.
  NOTIFICATION_TRANSIENT_MISS_GRACE_MS: 2 * 60 * 1000, // 2 minutes

  // Maximum number of missing notifications to verify with the API per fetch.
  // Larger drops are treated as real bulk reads/removals and are not retained.
  MAX_TRANSIENT_NOTIFICATION_VERIFICATIONS: 10,

  // Threshold for determining if a notification content block is "long" and needs truncating
  BLOCK_ALIGNMENT_LENGTH_THRESHOLD: 55,

  // Notification exit animation duration in milliseconds
  NOTIFICATION_EXIT_ANIMATION_DURATION_MS: 350,
};
