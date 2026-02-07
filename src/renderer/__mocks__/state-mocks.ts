import { Theme } from '../../shared/theme';

import {
  type AppearanceSettingsState,
  type AtlassifyState,
  type AuthState,
  type FilterSettingsState,
  type NotificationSettingsState,
  OpenPreference,
  type Percentage,
  type SettingsState,
  type SystemSettingsState,
  type TraySettingsState,
} from '../types';

import { mockAtlassianCloudAccount } from './account-mocks';

export const mockAuth: AuthState = {
  accounts: [mockAtlassianCloudAccount],
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

const mockFilters: FilterSettingsState = {
  engagementStates: [],
  categories: [],
  readStates: [],
  products: [],
  actors: [],
};

export const mockSettings: SettingsState = {
  ...mockAppearanceSettings,
  ...mockNotificationSettings,
  ...mockTraySettings,
  ...mockSystemSettings,
  ...mockFilters,
};

export const mockState: AtlassifyState = {
  auth: mockAuth,
  settings: mockSettings,
};
