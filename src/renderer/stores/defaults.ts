import { Theme } from '../../shared/theme';

import type { Percentage } from '../types';
import {
  type AccountsState,
  type AppearanceSettingsState,
  type FiltersState,
  type NotificationSettingsState,
  OpenPreference,
  type SettingsState,
  type SystemSettingsState,
  type TraySettingsState,
} from './types';

import { DEFAULT_LANGUAGE } from '../i18n';

/**
 * Default accounts state
 */
export const DEFAULT_ACCOUNTS_STATE: AccountsState = {
  accounts: [],
};

/**
 * Default filters state
 */
export const DEFAULT_FILTERS_STATE: FiltersState = {
  engagementStates: [],
  categories: [],
  readStates: [],
  products: [],
  actors: [],
};

/**
 * Default appearance settings
 */
const DEFAULT_APPEARANCE_SETTINGS: AppearanceSettingsState = {
  language: DEFAULT_LANGUAGE,
  theme: Theme.LIGHT,
  zoomPercentage: 100 as Percentage,
  showAccountHeader: true,
};

/**
 * Default notification settings
 */
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsState = {
  markAsReadOnOpen: true,
  delayNotificationState: false,
  fetchOnlyUnreadNotifications: true,
  groupNotificationsByProduct: false,
  groupNotificationsByProductAlphabetically: false,
  groupNotificationsByTitle: true,
};

/**
 * Default tray settings
 */
const DEFAULT_TRAY_SETTINGS: TraySettingsState = {
  showNotificationsCountInTray: true,
  useUnreadActiveIcon: true,
  useAlternateIdleIcon: false,
};

/**
 * Default system settings
 */
const DEFAULT_SYSTEM_SETTINGS: SystemSettingsState = {
  openLinks: OpenPreference.FOREGROUND,
  keyboardShortcutEnabled: true,
  showSystemNotifications: true,
  playSoundNewNotifications: true,
  notificationVolume: 20 as Percentage,
  openAtStartup: true,
};

/**
 * Default settings state (combined)
 */
export const DEFAULT_SETTINGS_STATE: SettingsState = {
  ...DEFAULT_APPEARANCE_SETTINGS,
  ...DEFAULT_NOTIFICATION_SETTINGS,
  ...DEFAULT_TRAY_SETTINGS,
  ...DEFAULT_SYSTEM_SETTINGS,
};
