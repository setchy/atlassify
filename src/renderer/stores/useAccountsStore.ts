import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Constants } from '../constants';

import type { Account, Token, Username } from '../types';
import type { AccountsStore } from './types';

import { getAuthenticatedUser } from '../utils/api/client';
import { encryptValue } from '../utils/comms';
import { rendererLogError } from '../utils/logger';
import { DEFAULT_ACCOUNTS_STATE } from './defaults';

/**
 * Atlassify Accounts store.
 *
 * Automatically persisted to local storage.
 * Tokens are encrypted via safeStorage before storage.
 */
export const useAccountsStore = create<AccountsStore>()(
  persist(
    (set, _get, store) => ({
      ...DEFAULT_ACCOUNTS_STATE,

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

      createAccount: async (username: Username, token: Token) => {
        const encryptedToken = await encryptValue(token);

        let newAccount = {
          username: username,
          token: encryptedToken,
        } as Account;

        // Refresh user data
        const get = _get as () => AccountsStore;
        newAccount = await get().refreshAccount(newAccount);

        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },

      refreshAccount: async (account: Account): Promise<Account> => {
        try {
          const res = await getAuthenticatedUser(account);

          account.id = res.data.me.user.accountId;
          account.name = res.data.me.user.name;
          account.avatar = res.data.me.user.picture;
        } catch (err) {
          rendererLogError(
            'refreshAccount',
            `failed to refresh account for user ${account.username}`,
            err,
          );
        }

        return account;
      },

      hasAccounts: () => {
        const get = _get as () => AccountsStore;
        return get().accounts.length > 0;
      },

      hasMultipleAccounts: () => {
        const get = _get as () => AccountsStore;
        return get().accounts.length > 1;
      },

      isLoggedIn: () => {
        const get = _get as () => AccountsStore;
        return get().hasAccounts();
      },

      hasUsernameAlready: (username: Username) => {
        const get = _get as () => AccountsStore;
        return get().accounts.some(
          (a) =>
            a.username.trim().toLowerCase() === username.trim().toLowerCase(),
        );
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
