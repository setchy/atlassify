import { Theme } from '../../shared/theme';

import { DEFAULT_LANGUAGE } from '../i18n';
import {
  type AppearanceSettingsState,
  type AuthState,
  type FilterSettingsState,
  type NotificationSettingsState,
  OpenPreference,
  type SettingsState,
  type SystemSettingsState,
} from '../types';

export const defaultAuth: AuthState = {
  accounts: [],
};

const defaultAppearanceSettings: AppearanceSettingsState = {
  language: DEFAULT_LANGUAGE,
  theme: Theme.LIGHT,
  zoomPercentage: 100,
};

const defaultNotificationSettings: NotificationSettingsState = {
  markAsReadOnOpen: true,
  delayNotificationState: false,
  fetchOnlyUnreadNotifications: true,
  groupNotificationsByProduct: false,
  groupNotificationsByProductAlphabetically: false,
  groupNotificationsByTitle: true,
};

const defaultSystemSettings: SystemSettingsState = {
  openLinks: OpenPreference.FOREGROUND,
  keyboardShortcutEnabled: true,
  showNotificationsCountInTray: true,
  showSystemNotifications: true,
  playSoundNewNotifications: true,
  notificationVolume: 20,
  useAlternateIdleIcon: false,
  openAtStartup: true,
};

export const defaultFilters: FilterSettingsState = {
  filterTimeSensitive: [],
  filterCategories: [],
  filterReadStates: [],
  filterProducts: [],
  filterActors: [],
};

export const defaultSettings: SettingsState = {
  ...defaultAppearanceSettings,
  ...defaultNotificationSettings,
  ...defaultSystemSettings,
  ...defaultFilters,
};
