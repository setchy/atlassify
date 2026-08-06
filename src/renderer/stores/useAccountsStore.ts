import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Constants } from '../constants';

import type {
  Account,
  AccountHostnameHint,
  CloudID,
  Hostname,
  Token,
  Username,
} from '../types';
import type { AccountsStore } from './types';

import {
  getAuthenticatedUser,
  getCloudIDsForHostnames,
} from '../utils/api/client';
import { rendererLogError } from '../utils/core/logger';
import { encryptValue } from '../utils/system/comms';
import { DEFAULT_ACCOUNTS_STATE } from './defaults';

/** Resolves Cloud IDs for a set of hostname hints via the Atlassian GraphQL API. */
async function resolveHostnameHints(
  account: Account,
  hints: AccountHostnameHint[],
): Promise<AccountHostnameHint[]> {
  const res = await getCloudIDsForHostnames(
    account,
    hints.map((hint) => hint.hostname),
  );

  const cloudIdsByHostname = new Map(
    (res.data?.tenantContexts ?? [])
      .filter((tenant) => tenant?.hostName && tenant.cloudId)
      .map((tenant) => [
        (tenant.hostName as Hostname).toLowerCase(),
        tenant.cloudId as CloudID,
      ]),
  );

  return hints.map((hint) => ({
    ...hint,
    cloudId: cloudIdsByHostname.get(hint.hostname.toLowerCase()) ?? null,
  }));
}

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
          hostnameHints: [],
        } as Account;

        // Refresh user data
        newAccount = await get().refreshAccount(newAccount);

        set((state) => ({
          accounts: [...state.accounts, newAccount],
        }));
      },

      /** Re-fetches user profile data and re-resolves hostname hints, updating the account in the store. Returns the updated account, or the original on failure. */
      refreshAccount: async (account: Account): Promise<Account> => {
        try {
          const res = await getAuthenticatedUser(account);
          const existingHints = account.hostnameHints ?? [];
          const hostnameHints =
            existingHints.length > 0
              ? await resolveHostnameHints(account, existingHints)
              : existingHints;

          const updatedAccount = {
            ...account,
            id: res.data.me.user.accountId,
            name: res.data.me.user.name,
            avatar: res.data.me.user.picture,
            hostnameHints,
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

      /** Adds a hostname hint to an account, resolving its Cloud ID. Returns `true` if resolved and saved. */
      addHostnameHint: async (
        account: Account,
        hostname: Hostname,
      ): Promise<boolean> => {
        // Hostnames are case-insensitive; normalize to lowercase for consistent storage/display.
        const trimmedHostname = hostname.trim().toLowerCase() as Hostname;

        const existingHints = account.hostnameHints ?? [];
        const alreadyExists = existingHints.some(
          (hint) => hint.hostname.toLowerCase() === trimmedHostname,
        );
        if (alreadyExists) {
          return false;
        }

        const [resolvedHint] = await resolveHostnameHints(account, [
          { hostname: trimmedHostname, cloudId: null },
        ]);

        if (!resolvedHint.cloudId) {
          return false;
        }

        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === account.id
              ? {
                  ...a,
                  hostnameHints: [...(a.hostnameHints ?? []), resolvedHint],
                }
              : a,
          ),
        }));

        return true;
      },

      /** Removes a hostname hint from an account. */
      removeHostnameHint: (account: Account, hostname: Hostname) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === account.id
              ? {
                  ...a,
                  hostnameHints: (a.hostnameHints ?? []).filter(
                    (hint) => hint.hostname !== hostname,
                  ),
                }
              : a,
          ),
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
