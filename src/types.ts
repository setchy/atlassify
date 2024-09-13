import type {
  Category,
  Product,
  ReadState,
  Repository,
  Subject,
} from './utils/api/types';
import type { AuthMethod, PlatformType } from './utils/auth/types';

declare const __brand: unique symbol;

type Brand<B> = { [__brand]: B };

export interface AuthState {
  accounts: Account[];
}

export type Branded<T, B> = T & Brand<B>;

export type Username = Branded<string, 'Username'>;

export type Token = Branded<string, 'Token'>;

export type Organization = Branded<string, 'Organization'>;

export type Link = Branded<string, 'WebUrl'>;

export type Status = 'loading' | 'success' | 'error';

export interface Account {
  method: AuthMethod;
  platform: PlatformType;
  token: Token;
  user: AtlasifyUser;
}

export type SettingsValue =
  | boolean
  | number
  | GroupBy
  | OpenPreference
  | Category[]
  | ReadState[]
  | Product[]
  | Theme;

export type SettingsState = AppearanceSettingsState &
  NotificationSettingsState &
  SystemSettingsState &
  FilterSettingsState;

interface AppearanceSettingsState {
  theme: Theme;
  zoomPercentage: number;
  showAccountHeader: boolean;
}

interface NotificationSettingsState {
  groupBy: GroupBy;
  delayNotificationState: boolean;
}

interface SystemSettingsState {
  openLinks: OpenPreference;
  keyboardShortcut: boolean;
  showNotificationsCountInTray: boolean;
  showSystemNotifications: boolean;
  useAlternateIdleIcon: boolean;
  playSound: boolean;
  openAtStartup: boolean;
}

interface FilterSettingsState {
  filterCategories: Category[];
  filterReadStates: ReadState[];
  filterProducts: Product[];
}

export interface AtlasifyState {
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
  BACKGROUND = 'FOREGROUND',
}

export enum GroupBy {
  PRODUCT = 'PRODUCT',
  REPOSITORY = 'REPOSITORY',
  DATE = 'DATE',
}

export type RadioGroupItem = {
  label: string;
  value: string;
};

export interface AccountNotifications {
  account: Account;
  notifications: AtlasifyNotification[];
  error: AtlasifyError | null;
}

export interface AtlasifyNotification {
  id: string;
  unread: boolean;
  updated_at: string;
  last_read_at: string | null;
  subject: Subject;
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
    name: Product;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    icon: any;
  };
  repository: Repository;
  category: Category;
  readState: ReadState;
  url: Link;
  subscription_url: Link;
  account: Account;
}

export interface AtlasifyUser {
  login: string;
  name: string | null;
  avatar: Link | null;
  id: string;
}

export interface AtlasifyError {
  title: string;
  descriptions: string[];
  emojis: string[];
}

export type ErrorType =
  | 'BAD_CREDENTIALS'
  | 'MISSING_SCOPES'
  | 'NETWORK'
  | 'RATE_LIMITED'
  | 'UNKNOWN';

export interface FormattedReason {
  title: string;
  description: string;
}

// TODO - Remove this
export enum IconColor {
  GRAY = 'text-gray-500 dark:text-gray-300',
  GREEN = 'text-green-500',
  PURPLE = 'text-purple-500',
  RED = 'text-red-500',
  YELLOW = 'text-yellow-500 dark:text-yellow-300',
  WHITE = 'text-white',
}

export enum Opacity {
  READ = 'opacity-50',
  LOW = 'opacity-70',
  MEDIUM = 'opacity-80',
  HIGH = 'opacity-90',
}

export enum Size {
  XSMALL = 12,
  SMALL = 14,
  MEDIUM = 16,
  LARGE = 18,
  XLARGE = 20,
}
