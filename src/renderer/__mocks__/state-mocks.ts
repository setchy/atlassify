import { Theme } from '../../shared/theme';

import {
  type Account,
  type AppearanceSettingsState,
  type AtlassifyState,
  type AuthState,
  type EncryptedToken,
  type FilterSettingsState,
  type Link,
  type NotificationSettingsState,
  OpenPreference,
  type Percentage,
  type SettingsState,
  type SystemSettingsState,
  type TraySettingsState,
  type Username,
} from '../types';

export const mockAtlassianCloudAccount: Account = {
  id: '123456789',
  username: 'user@atlassify.io' as Username,
  token: 'token-123-456' as EncryptedToken,
  name: 'Atlassify',
  avatar: 'https://avatar.atlassify.io' as Link,
};

export const mockAtlassianCloudAccountTwo: Account = {
  id: '987654321',
  username: 'other@atlassify.io' as Username,
  token: 'token-abc-xyz' as EncryptedToken,
  name: 'Another One',
  avatar: 'https://avatar.atlassify.io' as Link,
};

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
  filterEngagementStates: [],
  filterCategories: [],
  filterReadStates: [],
  filterProducts: [],
  filterActors: [],
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
