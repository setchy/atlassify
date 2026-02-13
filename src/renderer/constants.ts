export const Constants = {
  // Main storage key (deprecated - used for migration only)
  STORAGE_KEY: 'atlassify-storage',

  // Accounts store key
  ACCOUNTS_STORE_KEY: 'atlassify-accounts',

  // Settings store key
  SETTINGS_STORE_KEY: 'atlassify-settings',

  // Filters store key
  FILTERS_STORE_KEY: 'atlassify-filters',

  // i18n language storage key
  LANGUAGE_STORAGE_KEY: 'atlassify-language',

  // Emojis to use when all notifications are read
  ALL_READ_EMOJIS: ['🎉', '🎊', '🥳', '👏', '🙌', '😎', '🏖️', '🚀', '✨', '🏆'],

  // Fetch notifications interval in milliseconds, used by useNotifications hook
  FETCH_NOTIFICATIONS_INTERVAL_MS: 60 * 1000, // 1 minute

  // Fetch accounts interval in milliseconds, used by useAccounts hook
  REFRESH_ACCOUNTS_INTERVAL_MS: 60 * 60 * 1000, // 1 hour

  // Maximum number of notifications to fetch per account
  MAX_NOTIFICATIONS_PER_ACCOUNT: 999,

  // Threshold for determining if a notification content block is "long" and needs truncating
  BLOCK_ALIGNMENT_LENGTH_THRESHOLD: 55,
};
