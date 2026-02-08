import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Constants } from '../constants';

import type { Account } from '../types';

import { refreshAccount } from '../utils/auth/utils';

interface AccountsState {
  refetchAccounts: () => Promise<void>;
}

export const useAccounts = (accounts: Account[]): AccountsState => {
  const { refetch } = useQuery<boolean, Error>({
    queryKey: ['accounts', accounts.length],

    queryFn: async () => {
      if (!accounts.length) {
        return true;
      }

      await Promise.all(accounts.map(refreshAccount));
      return true;
    },

    refetchInterval: Constants.REFRESH_ACCOUNTS_INTERVAL_MS,
  });

  const refetchAccounts = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    refetchAccounts,
  };
};
