import { useCallback, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Constants } from '../constants';

import { useAccountsStore } from '../stores';

import { accountsKeys } from '../utils/api/queryKeys';
import { rendererLogWarn } from '../utils/logger';

/**
 * Custom hook to manage scheduled refresh of accounts.
 */
interface AccountsState {
  isLoading: boolean;
  error: Error | null;
  refreshAccounts: () => Promise<void>;
}

export const useAccounts = (): AccountsState => {
  const accounts = useAccountsStore((s) => s.accounts);
  const setAccounts = useAccountsStore.setState;
  const refreshAccount = useAccountsStore.getState().refreshAccount;

  // Query key
  const accountsQueryKeys = useMemo(
    () => accountsKeys.list(accounts.length),
    [accounts.length],
  );

  const { isLoading, error, refetch } = useQuery<boolean, Error>({
    queryKey: accountsQueryKeys,

    queryFn: async () => {
      // Perform partial refreshes: update only successfully refreshed accounts
      const refreshedAccounts = await Promise.all(
        accounts.map(async (account) => {
          try {
            return await refreshAccount(account);
          } catch (_err) {
            // If refresh fails, keep the original account
            rendererLogWarn(
              'useAccounts',
              `Failed to refresh account for user ${account.username}, keeping existing data.`,
            );
            return account;
          }
        }),
      );

      // Update the store immutably with the refreshed accounts
      setAccounts({ accounts: refreshedAccounts });

      return true;
    },

    enabled: accounts.length > 0,

    refetchInterval: Constants.REFRESH_ACCOUNTS_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

  const refreshAccounts = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    isLoading,
    error: error ?? null,
    refreshAccounts,
  };
};
