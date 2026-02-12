import { Theme } from '../../shared/theme';

import {
  type AccountsState,
  type AppearanceSettingsState,
  type NotificationSettingsState,
  OpenPreference,
  type SettingsState,
  type SystemSettingsState,
  type TraySettingsState,
} from '../stores/types';

import type { Percentage } from '../types';

import { mockAtlassianCloudAccount } from './account-mocks';

export const mockAccounts = [mockAtlassianCloudAccount];

export const mockAuth: AccountsState = {
  accounts: mockAccounts,
};

const mockAppearanceSettings: AppearanceSettingsState = {
  language: 'en',
  theme: Theme.LIGHT,
  zoomPercentage: 100 as Percentage,
};

const mockNotificationSettings: NotificationSettingsState = {
  markAsReadOnOpen: true,
  delayNotificationState: false,
  fetchOnlyUnreadNotifications: true,
  groupNotificationsByProduct: false,
  groupNotificationsByProductAlphabetically: false,
  groupNotificationsByTitle: true,
};

const mockTraySettings: TraySettingsState = {
  showNotificationsCountInTray: true,
  useUnreadActiveIcon: true,
  useAlternateIdleIcon: false,
};

const mockSystemSettings: SystemSettingsState = {
  openLinks: OpenPreference.FOREGROUND,
  keyboardShortcutEnabled: true,
  showSystemNotifications: true,
  playSoundNewNotifications: true,
  notificationVolume: 20 as Percentage,
  openAtStartup: true,
};

export const mockSettings: SettingsState = {
  ...mockAppearanceSettings,
  ...mockNotificationSettings,
  ...mockTraySettings,
  ...mockSystemSettings,
};
