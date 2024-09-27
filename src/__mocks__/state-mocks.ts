import {
  type Account,
  type AtlassifyState,
  type AuthState,
  type EncryptedToken,
  type Link,
  OpenPreference,
  type SettingsState,
  Theme,
  type Username,
} from '../types';

export const mockAtlassianCloudAccount: Account = {
  id: '123456789',
  username: 'user@atlassify.io' as Username,
  token: 'token-123-456' as EncryptedToken,
  name: 'Atlassify',
  avatar: 'https://avatar.atlassify.io' as Link,
};

export const mockAuth: AuthState = {
  accounts: [mockAtlassianCloudAccount],
};

const mockAppearanceSettings = {
  theme: Theme.LIGHT,
  zoomPercentage: 100,
};

const mockNotificationSettings = {
  markAsReadOnOpen: true,
  delayNotificationState: false,
  fetchOnlyUnreadNotifications: true,
  groupNotificationsByProduct: false,
};

const mockSystemSettings = {
  openLinks: OpenPreference.FOREGROUND,
  keyboardShortcutEnabled: true,
  showNotificationsCountInTray: true,
  showSystemNotifications: true,
  playSoundNewNotifications: true,
  useAlternateIdleIcon: false,
  openAtStartup: true,
};

const mockFilters = {
  filterCategories: [],
  filterReadStates: [],
  filterProducts: [],
};

export const mockSettings: SettingsState = {
  ...mockAppearanceSettings,
  ...mockNotificationSettings,
  ...mockSystemSettings,
  ...mockFilters,
};

export const mockState: AtlassifyState = {
  auth: mockAuth,
  settings: mockSettings,
};
