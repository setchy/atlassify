import type { Link } from '../types';

export const Constants = {
  REPO_SLUG: 'setchy/atlassify',

  STORAGE_KEY: 'atlassify-storage',

  NOTIFICATION_SOUND: 'notification.wav',

  ALL_READ_EMOJIS: ['🎉', '🎊', '🥳', '👏', '🙌', '😎', '🏖️', '🚀', '✨', '🏆'],

  FETCH_NOTIFICATIONS_INTERVAL: 60000,
  REFRESH_ACCOUNTS_INTERVAL: 3600000,

  MAX_NOTIFICATIONS_PER_ACCOUNT: 999,

  DEFAULT_KEYBOARD_SHORTCUT: 'CommandOrControl+Shift+G',

  ATLASSIAN_URLS: {
    API: 'https://team.atlassian.net/gateway/api/graphql' as Link,
    DOCS: {
      API_TOKEN_URL:
        'https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/' as Link,
    },
    WEB: {
      BITBUCKET_HOME: 'https://bitbucket.org' as Link,
      MY_NOTIFICATIONS: 'https://team.atlassian.com/notifications' as Link,
      PEOPLE: 'https://team.atlassian.com/people' as Link,
      SECURITY_TOKENS:
        'https://id.atlassian.com/manage-profile/security/api-tokens' as Link,
    },
  },
};
