import { useCallback, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Constants } from '../constants';

import { useAccountsStore } from '../stores';

import { accountsKeys } from '../utils/api/queryKeys';

interface UseAccountsResult {
  /** Whether the accounts query is currently loading. */
  isLoading: boolean;
  /** Any error thrown during the last fetch, or `null`. */
  error: Error | null;
  /** Manually triggers an immediate accounts refresh. */
  refreshAccounts: () => Promise<void>;
}

/**
 * Custom hook to manage scheduled refresh of accounts.
 */
export const useAccounts = (): UseAccountsResult => {
  const accounts = useAccountsStore((s) => s.accounts);
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
      await Promise.all(
        accounts.map(async (account) => {
          await refreshAccount(account);
        }),
      );
      return true;
    },

    enabled: accounts.length > 0,

    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    refetchInterval: Constants.REFRESH_ACCOUNTS_INTERVAL_MS,
    refetchIntervalInBackground: true,
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
