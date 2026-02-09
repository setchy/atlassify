import type { Theme } from '../../shared/theme';

import type { Language } from '../i18n/types';
import type {
  ActorType,
  CategoryType,
  EngagementStateType,
  OpenPreference,
  Percentage,
  ProductType,
  ReadStateType,
} from '../types';

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
   * The notification actors / authors .
   */
  actors: ActorType[];
}

/**
 * All Settings keys to be stored in the application.
 */
export type SettingsState = AppearanceSettingsState &
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
