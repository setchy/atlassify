import { useCallback, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Constants } from '../constants';

import { useIntervalTimer } from '../hooks/useIntervalTimer';
import { useAccountsStore } from '../stores';

import { accountsKeys } from '../utils/api/queryKeys';

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

    // Manual interval-based fetching (see useIntervalTimer below) instead of refetchInterval.
    // TanStack Query's refetchInterval uses the Page Visibility API and pauses when
    // document.hidden === true, which happens when the menubar window is hidden (normal state).
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  /**
   * Manual interval-based fetching for reliable background updates in Electron tray apps.
   *
   * TanStack Query's refetchInterval uses the Page Visibility API, which pauses when
   * document.hidden === true. For menubar apps, the window is hidden most of the time,
   * so refetchInterval would effectively never run in the background.
   *
   * This setInterval-based approach continues running regardless of window visibility,
   * ensuring accounts stay fresh even when the app is hidden in the system tray.
   * It also provides graceful recovery after system sleep/suspend cycles.
   */
  useIntervalTimer(() => {
    refetch();
  }, Constants.REFRESH_ACCOUNTS_INTERVAL_MS);

  const refreshAccounts = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    isLoading,
    error: error ?? null,
    refreshAccounts,
  };
};
