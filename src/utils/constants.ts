import type { Link } from '../types';

export const Constants = {
  REPO_SLUG: 'setchy/atlasify',

  // Storage
  STORAGE_KEY: 'atlasify-storage',

  ALL_READ_EMOJIS: ['🎉', '🎊', '🥳', '👏', '🙌', '😎', '🏖️', '🚀', '✨', '🏆'],

  FETCH_NOTIFICATIONS_INTERVAL: 60000,
  REFRESH_ACCOUNTS_INTERVAL: 3600000,

  DEFAULT_KEYBOARD_SHORTCUT: 'CommandOrControl+Shift+G',

  // API
  ATLASSIAN_API: 'https://team.atlassian.net/gateway/api/graphql' as Link,

  // Web Links
  ATLASSIAN_WEB: {
    MY_NOTIFICATIONS: 'https://team.atlassian.com/notifications' as Link,
  },

  // Atlassian Docs
  ATLASSIAN_DOCS: {
    API_TOKEN_URL:
      'https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/' as Link,
  },
};
