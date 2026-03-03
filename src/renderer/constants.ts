export const Constants = {
  // Local storage keys
  STORAGE: {
    // Legacy storage key (deprecated - used for migration only)
    LEGACY: 'atlassify-storage',
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

  // Query stale time in milliseconds, used by TanStack Query client
  QUERY_STALE_TIME_MS: 30 * 1000, // 30 seconds

  // Maximum number of notifications to fetch per account
  MAX_NOTIFICATIONS_PER_ACCOUNT: 999,

  // Threshold for determining if a notification content block is "long" and needs truncating
  BLOCK_ALIGNMENT_LENGTH_THRESHOLD: 55,

  // Notification exit animation duration in milliseconds
  NOTIFICATION_EXIT_ANIMATION_DURATION_MS: 350,
};
