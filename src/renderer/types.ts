import type ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import type ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import type ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import type { LogoProps } from '@atlaskit/logo';

import type { Theme } from '../shared/theme';

import type { Language } from './i18n/types';

declare const __brand: unique symbol;

type Brand<B> = { [__brand]: B };

export type Branded<T, B> = T & Brand<B>;

/**
 * A username for an Atlassian account.
 */
export type Username = Branded<string, 'Username'>;

/**
 * An API Token for an Atlassian account.
 */
export type Token = Branded<string, 'Token'>;

/**
 * An API Token encrypted using the electron safe storage API.
 */
export type EncryptedToken = Branded<string, 'Token'>;

/**
 * An OAuth access token for an Atlassian account.
 */
export type OAuthAccessToken = Branded<string, 'OAuthAccessToken'>;

/**
 * An OAuth refresh token for an Atlassian account.
 */
export type OAuthRefreshToken = Branded<string, 'OAuthRefreshToken'>;

/**
 * An encrypted OAuth access token using the electron safe storage API.
 */
export type EncryptedOAuthAccessToken = Branded<string, 'EncryptedOAuthAccessToken'>;

/**
 * An encrypted OAuth refresh token using the electron safe storage API.
 */
export type EncryptedOAuthRefreshToken = Branded<string, 'EncryptedOAuthRefreshToken'>;

/**
 * A URL for a web resource.
 */
export type Link = Branded<string, 'WebUrl'>;

/**
 * The status of the applications data fetching process.
 */
export type Status = 'loading' | 'success' | 'error';

/**
 * The hostname of an Atlassian tenant
 */
export type Hostname = Branded<string, 'Hostname'>;

/**
 * An Atlassian tenant cloud id
 */
export type CloudID = Branded<string, 'CloudID'>;

/**
 * The Jira project key
 */
export type JiraProjectKey = Branded<string, 'JiraProjectKey'>;

/**
 * Percentage value between 0 and 100
 */
export type Percentage = Branded<number, 'Percentage'>;

/**
 * Authentication method for an Atlassian account.
 */
export enum AuthMethod {
  /**
   * API Token authentication (username + API token)
   */
  API_TOKEN = 'API_TOKEN',
  /**
   * OAuth 2.0 authentication (access token + refresh token)
   */
  OAUTH = 'OAUTH',
}

/**
 * An Atlassian account.
 */
export interface Account {
  /**
   *  The unique identifier for the account.
   */
  id: string;

  /**
   *  The username for the account.
   */
  username: Username;

  /**
   *  The authentication method used for this account.
   */
  authMethod: AuthMethod;

  /**
   *  The encrypted API token for the account (only for API_TOKEN auth method).
   */
  token?: EncryptedToken;

  /**
   *  The encrypted OAuth access token for the account (only for OAUTH auth method).
   */
  oauthAccessToken?: EncryptedOAuthAccessToken;

  /**
   *  The encrypted OAuth refresh token for the account (only for OAUTH auth method).
   */
  oauthRefreshToken?: EncryptedOAuthRefreshToken;

  /**
   * The display name for the account user.
   */
  name: string;

  /**
   * The avatar for the account user.
   */
  avatar: Link | null;
}

/**
 * All allowed Config and Filter Settings values to be stored in the application.
 */
export type SettingsValue = ConfigSettingsValue | FilterSettingsValue[];

/**
 * All Config Settings values to be stored in the application.
 */
export type ConfigSettingsValue =
  | boolean
  | number
  | OpenPreference
  | Percentage
  | Theme;

/**
 * All Filter Settings values to be stored in the application.
 */
export type FilterSettingsValue =
  | ActorType
  | CategoryType
  | EngagementStateType
  | ProductType
  | ReadStateType;

/**
 * All allowed Config and Filter Settings keys to be stored in the application.
 */
export type SettingsState = ConfigSettingsState & FilterSettingsState;

/**
 * All Config Settings keys to be stored in the application.
 */
export type ConfigSettingsState = AppearanceSettingsState &
  NotificationSettingsState &
  TraySettingsState &
  SystemSettingsState;

/**
 * Settings related to the appearance of the application.
 */
export interface AppearanceSettingsState {
  /**
   * The language of the application.
   */
  language: Language;

  /**
   * The theme of the application.
   */
  theme: Theme;

  /**
   * The zoom percentage of the application.
   */
  zoomPercentage: Percentage;
}

/**
 * Settings related to the notifications within the application.
 */
export interface NotificationSettingsState {
  /**
   * Whether to mark notifications as read when they are opened.
   */
  markAsReadOnOpen: boolean;

  /**
   * Whether to delay the notification state changes upon interactions.
   */
  delayNotificationState: boolean;

  /**
   * Whether to fetch only unread notifications, or all notifications.
   */
  fetchOnlyUnreadNotifications: boolean;

  /**
   * Whether to group notifications by product.
   */
  groupNotificationsByProduct: boolean;

  /**
   * Whether to sort grouped notifications by product alphabetically or time.
   */
  groupNotificationsByProductAlphabetically: boolean;

  /**
   * Whether to group notifications by title.
   */
  groupNotificationsByTitle: boolean;
}

/**
 * Settings related to the tray / menu bar behavior.
 */
export interface TraySettingsState {
  /**
   * Whether to show the notifications count in the tray icon.
   */
  showNotificationsCountInTray: boolean;

  /**
   * Whether to use the active green icon for highlighting unread notifications
   */
  useUnreadActiveIcon: boolean;

  /**
   * Whether to use the alternate white idle icon, suitable for devices which have dark-themed system bars
   */
  useAlternateIdleIcon: boolean;
}

/**
 * Settings related to the system behavior of the application.
 */
export interface SystemSettingsState {
  /**
   * The preference for opening links upon notification interactions
   */
  openLinks: OpenPreference;

  /**
   * Whether to enable the keyboard shortcuts for the application.
   */
  keyboardShortcutEnabled: boolean;

  /**
   * Whether to show/raise system notifications.
   */
  showSystemNotifications: boolean;

  /**
   * Whether to play a sound for new notifications.
   */
  playSoundNewNotifications: boolean;

  /**
   * The volume for the notification sound.
   */
  notificationVolume: Percentage;

  /**
   * Whether to open the application on system startup.
   */
  openAtStartup: boolean;
}

/**
 * Settings related to the filtering of notifications within the application.
 */
export interface FilterSettingsState {
  /**
   * The engagement states to filter notifications by.
   */
  filterEngagementStates: EngagementStateType[];

  /**
   * The categories to filter notifications by.
   */
  filterCategories: CategoryType[];

  /**
   * The read states to filter notifications by.
   */
  filterReadStates: ReadStateType[];

  /**
   * The products to filter notifications by.
   */
  filterProducts: ProductType[];

  /**
   * The notification actors / authors .
   */
  filterActors: ActorType[];
}

export interface AuthState {
  accounts: Account[];
}

/**
 * The state of the application, including authenticated accounts and application settings.
 */
export interface AtlassifyState {
  /**
   * Authenticated Atlassian accounts for use by Atlassify.
   */
  auth?: AuthState;

  /**
   * The settings for the application.
   */
  settings?: SettingsState;
}

/**
 * System preference for opening web resources / links.
 */
export enum OpenPreference {
  FOREGROUND = 'FOREGROUND',
  BACKGROUND = 'BACKGROUND',
}

/**
 * Notifications state for a given authenticated Atlassian account.
 */
export interface AccountNotifications {
  /**
   * The account that the notifications belong to.
   */
  account: Account;

  /**
   * The notifications for the account.
   */
  notifications: AtlassifyNotification[];

  /**
   * An indicator of whether there were further notifications on the server that were not fetched.
   */
  hasMoreNotifications: boolean;

  /**
   * The status of the notifications data fetching process.
   */
  error: AtlassifyError | null;
}

/**
 * An Atlassify notification.
 */
export interface AtlassifyNotification {
  /**
   * The unique identifier for the notification.
   */
  id: string;

  /**
   * The display order for the notification
   */
  order: number;

  /**
   * The update message for the notification.
   */
  message: string;

  /**
   * The timestamp for the notification.
   */
  updated_at: string;

  /**
   * The read state for the notification (read, unread).
   */
  readState: ReadStateType;

  /**
   * The category for the notification (direct, watching).
   */
  category: CategoryType;

  /**
   * The Atlassian product associated with the notification.
   */
  product: AtlassianProduct;

  /**
   * The type of the notification.
   */
  type: string;

  /**
   * The URL for the notification.
   */
  url: Link;

  /**
   * The parent details for the notification entity
   */
  path: AtlassifyNotificationPath;

  /**
   * The entity for which the notification is for.
   */
  entity: AtlassifyNotificationEntity;

  /**
   * The actor who created the notification.
   */
  actor: AtlassifyActor;

  /**
   * The account that the notification belongs to.
   */
  account: Account;

  /**
   * The notification group details when not fetching as flat list.
   */
  notificationGroup: AtlassifyNotificationGroup;
}

export interface AtlassifyActor {
  displayName: string;
  avatarURL: Link;
}

/**
 * The notification group details when not fetching as flat list.
 */
export interface AtlassifyNotificationGroup {
  /**
   * The unique identifier for the notification group.
   */
  id: string;

  /**
   * The group size for the notification group.'
   */
  size: number;

  /**
   * Additional actors that made updates as part of the group.
   */
  additionalActors: AtlassifyActor[];
}

/**
 * The parent details for the notification entity
 */
export interface AtlassifyNotificationPath {
  title: string;
  url: Link;
  iconUrl: Link | null;
}

/**
 * The entity for which the notification is for.
 */
export interface AtlassifyNotificationEntity {
  title: string;
  iconUrl: Link;
  url: Link;
}

/**
 * Atlassify error details.
 */
export interface AtlassifyError {
  /**
   * The title of the error.
   */
  title: string;

  /**
   * The description paragraphs explaining the error.
   */
  descriptions: string[];

  /**
   * An array of emojis that suitably summarize the error message.
   */
  emojis: string[];
}

/**
 * The different types of errors which may be encountered.
 */
export type ErrorType =
  | 'BAD_CREDENTIALS'
  | 'BAD_REQUEST'
  | 'NETWORK'
  | 'UNKNOWN';

/**
 * Details for Chevron header accordion.
 */
export interface Chevron {
  /**
   * The chevron icon.
   */
  icon:
    | typeof ChevronLeftIcon
    | typeof ChevronRightIcon
    | typeof ChevronDownIcon;

  /**
   * The chevron label.
   */
  label: string;
}

/**
 * The notification category.
 *
 * - `direct` - A direct notification event.
 * - `watching` - A watched notification event.
 */
export type CategoryType = 'direct' | 'watching';

/**
 * The read state of the notification.
 *
 * - `unread` - The notification has not been read.
 * - `read` - The notification has been read.
 */
export type ReadStateType = 'unread' | 'read';

/**
 * Types of notifications that are a result of others engaging with your work.
 *
 * - 'mention' - A user has mentioned you as part of the notification.
 * - 'comment' - A user has commented on your work.
 * - 'reaction' - A user has reacted on your work.
 */
export type EngagementStateType = 'mention' | 'comment' | 'reaction';

/**
 * The actor type.
 *
 * - 'user' - A user actor created the notification.
 * - 'automation' - An automation actor created the notification.
 */
export type ActorType = 'user' | 'automation';

/**
 * Atlassian products which are currently supported by Atlassify.
 */
export type ProductType =
  | 'bitbucket'
  | 'confluence'
  | 'compass'
  | 'home'
  | 'jira'
  | 'jira_product_discovery'
  | 'jira_service_management'
  | 'rovo_dev'
  | 'teams'
  | 'unknown';

/**
 * Details for a specific Atlassian product.
 */
export interface AtlassianProduct {
  /**
   * The type of the product.
   */
  type: ProductType;

  /**
   * The display name of the product.
   */
  display: string;

  /**
   * The logo of the product.
   *
   * See https://atlassian.design/components/logo/examples for available logos.
   */
  logo?: React.ComponentType<LogoProps>;

  /**
   * The URL to the product's home page.
   */
  home?: Link;
}
