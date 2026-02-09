import { createContext } from 'react';

import type {
  Account,
  AccountNotifications,
  AtlassifyError,
  AtlassifyNotification,
  AuthState,
  SettingsState,
  SettingsValue,
  Status,
} from '../types';
import type { LoginOptions } from '../utils/auth/types';

export interface AppContextState {
  auth: AuthState;
  isLoggedIn: boolean;
  login: (data: LoginOptions) => Promise<void>;
  logoutFromAccount: (account: Account) => void;

  status: Status;
  globalError: AtlassifyError;

  notifications: AccountNotifications[];
  notificationCount: number;
  hasNotifications: boolean;
  hasMoreAccountNotifications: boolean;

  fetchNotifications: () => Promise<void>;

  markNotificationsRead: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;

  settings: SettingsState;
  resetSettings: () => void;
  updateSetting: (name: keyof SettingsState, value: SettingsValue) => void;
}

export const AppContext = createContext<Partial<AppContextState> | undefined>(
  undefined,
);
