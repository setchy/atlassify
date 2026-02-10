import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Constants } from '../constants';

import type { Account, AuthState } from '../types';

interface AccountsActions {
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  removeAccount: (account: Account) => void;
  reset: () => void;
}

type AccountsStore = AuthState & AccountsActions;

/**
 * Default accounts state
 */
export const defaultAccountsState: AuthState = {
  accounts: [],
};

/**
 * Atlassify Accounts store.
 *
 * Automatically persisted to local storage.
 * Tokens are encrypted via safeStorage before storage.
 */
export const useAccountsStore = create<AccountsStore>()(
  persist(
    (set, _get, store) => ({
      ...defaultAccountsState,

      setAccounts: (accounts) => {
        set({ accounts });
      },

      addAccount: (account) => {
        set((state) => ({
          accounts: [...state.accounts, account],
        }));
      },

      removeAccount: (account) => {
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== account.id),
        }));
      },

      reset: () => {
        set(store.getInitialState());
      },
    }),
    {
      name: Constants.ACCOUNTS_STORE_KEY,
    },
  ),
);

export default useAccountsStore;
