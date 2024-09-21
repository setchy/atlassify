import {
  type Account,
  type AtlassifyState,
  type AtlassifyUser,
  type AuthState,
  type Link,
  OpenPreference,
  type SettingsState,
  Theme,
  type Token,
  type Username,
} from '../types';

export const mockAtlassifyUser: AtlassifyUser = {
  login: 'atlas' as Username,
  name: 'Atlassian',
  id: '123456789',
  avatar: 'https://avatars.githubusercontent.com/u/583231?v=4' as Link,
};

export const mockAtlassianCloudAccount: Account = {
  platform: 'Atlassian Cloud',
  method: 'API Token',
  token: 'token-123-456' as Token,
  user: mockAtlassifyUser,
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
  openAtStartup: false,
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
