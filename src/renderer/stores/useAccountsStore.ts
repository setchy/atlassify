import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Constants } from '../constants';

import type { Account, Link, Token, Username } from '../types';
import type { AccountsStore } from './types';

import { getAuthenticatedUser } from '../utils/api/client';
import { rendererLogError } from '../utils/core/logger';
import { encryptValue } from '../utils/system/comms';
import { DEFAULT_ACCOUNTS_STATE } from './defaults';

/**
 * Atlassify Accounts store.
 *
 * Automatically persisted to local storage.
 * Tokens are encrypted via safeStorage before storage.
 */
const useAccountsStore = create<AccountsStore>()(
  persist(
    (set, get, store) => ({
      ...DEFAULT_ACCOUNTS_STATE,

      /** Creates a new account, encrypts the token, fetches the user profile and persists to the store. */
      createAccount: async (username: Username, token: Token) => {
        const encryptedToken = await encryptValue(token);

        let newAccount = {
          username: username,
          token: encryptedToken,
        } as Account;

        // Refresh user data
        newAccount = await get().refreshAccount(newAccount);

        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },

      /** Re-fetches user profile data from the API and updates the account in the store. Returns the updated account, or the original on failure. */
      refreshAccount: async (account: Account): Promise<Account> => {
        try {
          const res = await getAuthenticatedUser(account);
          const updatedAccount = {
            ...account,
            id: res.data.me.user.accountId,
            name: res.data.me.user.name,
            avatar: res.data.me.user.picture as Link,
          };

          set((state) => ({
            accounts: state.accounts.map((a) =>
              a.id === account.id || a.username === account.username
                ? updatedAccount
                : a,
            ),
          }));

          return updatedAccount;
        } catch (err) {
          rendererLogError(
            'refreshAccount',
            `failed to refresh account for user ${account.username}`,
            err,
          );
          // Return the original account if refresh fails
          return account;
        }
      },

      /** Removes an account from the store by its ID. */
      removeAccount: (account) => {
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== account.id),
        }));
      },

      /** Returns `true` if at least one account is logged in. */
      isLoggedIn: () => {
        return get().accounts.length > 0;
      },

      /** Returns `true` if more than one account exists. */
      hasMultipleAccounts: () => {
        return get().accounts.length > 1;
      },

      /** Returns `true` if the username already exists in the store (case-insensitive). */
      hasUsernameAlready: (username: Username) => {
        return get().accounts.some(
          (a) =>
            a.username.trim().toLowerCase() === username.trim().toLowerCase(),
        );
      },

      /** Resets the store to its initial state, clearing all accounts. */
      reset: () => {
        set(store.getInitialState());
      },
    }),
    {
      name: Constants.STORAGE.ACCOUNTS,
    },
  ),
);

export default useAccountsStore;
