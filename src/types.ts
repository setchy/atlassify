import type { Category, ReadState } from './utils/api/types';

declare const __brand: unique symbol;

type Brand<B> = { [__brand]: B };

export interface AuthState {
  accounts: Account[];
}

export type Branded<T, B> = T & Brand<B>;

export type Username = Branded<string, 'Username'>;

export type Token = Branded<string, 'Token'>;

/**
 * A token encrypted using the electron safe storage API.
 */
export type EncryptedToken = Branded<string, 'Token'>;

export type Link = Branded<string, 'WebUrl'>;

export type Status = 'loading' | 'success' | 'error';

export interface Account {
  id: string;
  username: Username;
  token: EncryptedToken;
  name: string;
  avatar: Link | null;
}

export type SettingsValue =
  | boolean
  | number
  | OpenPreference
  | Category[]
  | ReadState[]
  | ProductName[]
  | Theme;

export type SettingsState = AppearanceSettingsState &
  NotificationSettingsState &
  SystemSettingsState &
  FilterSettingsState;

interface AppearanceSettingsState {
  theme: Theme;
  zoomPercentage: number;
}

interface NotificationSettingsState {
  markAsReadOnOpen: boolean;
  delayNotificationState: boolean;
  fetchOnlyUnreadNotifications: boolean;
  groupNotificationsByProduct: boolean;
}

interface SystemSettingsState {
  openLinks: OpenPreference;
  keyboardShortcutEnabled: boolean;
  showNotificationsCountInTray: boolean;
  showSystemNotifications: boolean;
  useAlternateIdleIcon: boolean;
  playSoundNewNotifications: boolean;
  openAtStartup: boolean;
}

interface FilterSettingsState {
  filterCategories: Category[];
  filterReadStates: ReadState[];
  filterProducts: ProductName[];
}

export interface AtlassifyState {
  auth?: AuthState;
  settings?: SettingsState;
}

export enum Theme {
  SYSTEM = 'SYSTEM',
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export enum OpenPreference {
  FOREGROUND = 'FOREGROUND',
  BACKGROUND = 'BACKGROUND',
}

export type RadioGroupItem = {
  label: string;
  value: string;
};

export interface AccountNotifications {
  account: Account;
  notifications: AtlassifyNotification[];
  hasMoreNotifications: boolean;
  error: AtlassifyError | null;
}

export interface AtlassifyNotification {
  id: string;
  title: string;
  readState: ReadState;
  updated_at: string;
  type: string;
  url: Link;
  path: {
    title: string;
    url: Link;
    iconUrl: Link | null;
  };
  entity: {
    title: string;
    iconUrl: Link;
    url: Link;
  };
  product: {
    name: ProductName;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    icon: any;
  };
  actor: {
    displayName: string;
    avatarURL: Link;
  };
  category: Category;
  account: Account;
}

export interface AtlassifyUser {
  login: Username;
  name: string | null;
  avatar: Link | null;
  id: string;
}

export interface AtlassifyError {
  title: string;
  descriptions: string[];
  emojis: string[];
}

export type ErrorType =
  | 'BAD_CREDENTIALS'
  | 'BAD_REQUEST'
  | 'NETWORK'
  | 'UNKNOWN';

export interface FormattedReason {
  title: string;
  description: string;
}

export enum Opacity {
  READ = 'opacity-50',
  LOW = 'opacity-70',
  MEDIUM = 'opacity-80',
  HIGH = 'opacity-90',
}

export interface AtlassianProduct {
  name: ProductName;
  icon: React.ComponentType;
  home?: Link;
}

export interface FilterDetails {
  name: string;
  description: string;
  icon?: React.ComponentType;
}

export type ProductName =
  | 'bitbucket'
  | 'confluence'
  | 'compass'
  | 'jira'
  | 'jira product discovery'
  | 'jira service management'
  | 'team central (atlas)'
  | 'trello'
  | 'unknown';
