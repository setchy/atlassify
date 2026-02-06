import { createContext } from 'react';

import type {
  Account,
  ConfigSettingsState,
  ConfigSettingsValue,
  FilterSettingsState,
  FilterSettingsValue,
  SettingsState,
} from '../types';
import type { LoginOptions } from '../utils/auth/types';

export interface AppContextState {
  auth: {
    accounts: Account[];
  };
  isLoggedIn: boolean;
  login: (data: LoginOptions) => Promise<void>;
  logoutFromAccount: (account: Account) => void;

  settings: SettingsState;
  clearFilters: () => void;
  resetSettings: () => void;
  updateSetting: (
    name: keyof ConfigSettingsState,
    value: ConfigSettingsValue,
  ) => void;
  updateFilter: (
    name: keyof FilterSettingsState,
    value: FilterSettingsValue,
    checked: boolean,
  ) => void;
}

export const AppContext = createContext<Partial<AppContextState> | undefined>(
  undefined,
);
