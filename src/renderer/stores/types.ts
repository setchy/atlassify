import type { Theme } from '../../shared/theme';

import type { Language } from '../i18n/types';
import type {
  Account,
  ActorType,
  CategoryType,
  EngagementStateType,
  Percentage,
  ProductType,
  ReadStateType,
  Token,
  Username,
} from '../types';

/**
 * System preference for opening web resources / links.
 */
export enum OpenPreference {
  FOREGROUND = 'FOREGROUND',
  BACKGROUND = 'BACKGROUND',
}

// ============================================================================
// Accounts Store Types
// ============================================================================

/**
 * The authenticated accounts state.
 */
export interface AccountsState {
  accounts: Account[];
}

/**
 * Actions for managing accounts.
 */
export interface AccountsActions {
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  removeAccount: (account: Account) => void;
  createAccount: (username: Username, token: Token) => Promise<void>;
  refreshAccount: (account: Account) => Promise<Account>;
  hasAccounts: () => boolean;
  hasMultipleAccounts: () => boolean;
  isLoggedIn: () => boolean;
  hasUsernameAlready: (username: Username) => boolean;
  reset: () => void;
}

/**
 * Complete accounts store type.
 */
export type AccountsStore = AccountsState & AccountsActions;

// ============================================================================
// Filters Store Types
// ============================================================================

/**
 * Settings related to the filtering of notifications within the application.
 */
export interface FiltersState {
  /**
   * The engagement states to filter notifications by.
   */
  engagementStates: EngagementStateType[];

  /**
   * The categories to filter notifications by.
   */
  categories: CategoryType[];

  /**
   * The read states to filter notifications by.
   */
  readStates: ReadStateType[];

  /**
   * The products to filter notifications by.
   */
  products: ProductType[];

  /**
   * The notification actors / authors.
   */
  actors: ActorType[];
}

/**
 * All allowed Filter types.
 * Automatically derived from the FiltersState.
 */
export type FilterKey = keyof FiltersState;

/**
 * Type-safe update function for filters.
 */
export type UpdateFilter = <K extends FilterKey>(
  key: K,
  value: FiltersState[K][number],
  checked: boolean,
) => void;

/**
 * Actions for managing filters.
 */
export interface FiltersActions {
  hasActiveFilters: () => boolean;
  updateFilter: UpdateFilter;
  reset: () => void;
}

/**
 * Complete filters store type.
 */
export type FiltersStore = FiltersState & FiltersActions;

// ============================================================================
// Settings Store Types
// ============================================================================

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

  /**
   * Show account header
   */
  showAccountHeader: boolean;
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
   * Whether to use the active green icon for highlighting unread notifications.
   */
  useUnreadActiveIcon: boolean;

  /**
   * Whether to use the alternate white idle icon, suitable for devices which have dark-themed system bars.
   */
  useAlternateIdleIcon: boolean;
}

/**
 * Settings related to the system behavior of the application.
 */
export interface SystemSettingsState {
  /**
   * The preference for opening links upon notification interactions.
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
 * All Settings combined.
 */
export type SettingsState = AppearanceSettingsState &
  NotificationSettingsState &
  TraySettingsState &
  SystemSettingsState;

/**
 * Actions for managing settings.
 */
export interface SettingsActions {
  updateSetting: <K extends keyof SettingsState>(
    name: K,
    value: SettingsState[K],
  ) => void;
  reset: () => void;
}

/**
 * Complete settings store type.
 */
export type SettingsStore = SettingsState & SettingsActions;
