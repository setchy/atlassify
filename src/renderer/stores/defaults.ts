import { Theme } from '../../shared/theme';

import { type AuthState, OpenPreference, type Percentage } from '../types';
import type {
  AppearanceSettingsState,
  FiltersState,
  NotificationSettingsState,
  SettingsState,
  SystemSettingsState,
  TraySettingsState,
} from './types';

import { DEFAULT_LANGUAGE } from '../i18n';

export const defaultAuth: AuthState = {
  accounts: [],
};

const defaultAppearanceSettings: AppearanceSettingsState = {
  language: DEFAULT_LANGUAGE,
  theme: Theme.LIGHT,
  zoomPercentage: 100 as Percentage,
};

const defaultNotificationSettings: NotificationSettingsState = {
  markAsReadOnOpen: true,
  delayNotificationState: false,
  fetchOnlyUnreadNotifications: true,
  groupNotificationsByProduct: false,
  groupNotificationsByProductAlphabetically: false,
  groupNotificationsByTitle: true,
};

const defaultTraySettings: TraySettingsState = {
  showNotificationsCountInTray: true,
  useUnreadActiveIcon: true,
  useAlternateIdleIcon: false,
};

const defaultSystemSettings: SystemSettingsState = {
  openLinks: OpenPreference.FOREGROUND,
  keyboardShortcutEnabled: true,
  showSystemNotifications: true,
  playSoundNewNotifications: true,
  notificationVolume: 20 as Percentage,
  openAtStartup: true,
};

/**
 * Default settings state
 */
export const defaultSettings: SettingsState = {
  ...defaultAppearanceSettings,
  ...defaultNotificationSettings,
  ...defaultTraySettings,
  ...defaultSystemSettings,
};

/**
 * Default filter state
 */
export const defaultFiltersState: FiltersState = {
  engagementStates: [],
  categories: [],
  readStates: [],
  products: [],
  actors: [],
};
