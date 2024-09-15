import {
  type Account,
  type AtlasifyState,
  type AtlasifyUser,
  type AuthState,
  GroupBy,
  type Link,
  OpenPreference,
  type SettingsState,
  Theme,
  type Token,
} from '../types';

export const mockAtlasifyUser: AtlasifyUser = {
  login: 'atlas',
  name: 'Atlassian',
  id: '123456789',
  avatar: 'https://avatars.githubusercontent.com/u/583231?v=4' as Link,
};

export const mockAtlassianCloudAccount: Account = {
  platform: 'Atlassian Cloud',
  method: 'API Token',
  token: 'token-123-456' as Token,
  user: mockAtlasifyUser,
};

export const mockAuth: AuthState = {
  accounts: [mockAtlassianCloudAccount],
};

const mockAppearanceSettings = {
  theme: Theme.LIGHT,
  zoomPercentage: 100,
};

const mockNotificationSettings = {
  groupBy: GroupBy.DATE,
  markAsReadOnOpen: true,
  delayNotificationState: false,
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

export const mockState: AtlasifyState = {
  auth: mockAuth,
  settings: mockSettings,
};
