import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { Constants } from '../constants';

import type { Account } from '../types';

import { refreshAccount } from '../utils/auth/utils';

interface AccountsState {
  refetchAccounts: () => Promise<void>;
}

export const useAccounts = (accounts: Account[]): AccountsState => {
  const { refetch: queryRefetch } = useQuery<void, Error>({
    queryKey: ['accounts', accounts.length],

    queryFn: async () => {
      if (!accounts.length) {
        return;
      }

      await Promise.all(accounts.map(refreshAccount));
    },

    refetchInterval: Constants.REFRESH_ACCOUNTS_INTERVAL_MS,
  });

  const refetchAccounts = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  return {
    refetchAccounts,
  };
};
