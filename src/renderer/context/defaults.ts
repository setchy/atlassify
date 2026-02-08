import { Theme } from '../../shared/theme';

import {
  type AppearanceSettingsState,
  type AuthState,
  type NotificationSettingsState,
  OpenPreference,
  type Percentage,
  type SettingsState,
  type SystemSettingsState,
  type TraySettingsState,
} from '../types';

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

export const defaultSettings: SettingsState = {
  ...defaultAppearanceSettings,
  ...defaultNotificationSettings,
  ...defaultTraySettings,
  ...defaultSystemSettings,
};
