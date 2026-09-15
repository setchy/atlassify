import { waitFor } from '@testing-library/react';

import { renderHookWithProviders } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import { Constants } from '../constants';

import { useAccountsStore } from '../stores';

import { useAccounts } from './useAccounts';

describe('renderer/hooks/useAccounts.ts', () => {
  it('uses the account polling cadence and removes its wake listener', async () => {
    const unsubscribe = vi.fn();
    vi.mocked(window.atlassify.onSystemWake).mockReturnValueOnce(unsubscribe);
    useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
    vi.spyOn(useAccountsStore.getState(), 'refreshAccount').mockResolvedValue(
      mockAtlassianCloudAccount,
    );

    const { queryClient, unmount } = renderHookWithProviders(() =>
      useAccounts(),
    );

    await waitFor(() =>
      expect(queryClient.getQueryCache().getAll()).toHaveLength(1),
    );
    const query = queryClient.getQueryCache().getAll()[0];
    const observerOptions = query.observers[0].options;

    expect(observerOptions.staleTime).toBe(
      Constants.REFRESH_ACCOUNTS_INTERVAL_MS,
    );
    expect(observerOptions.refetchInterval).toBe(
      Constants.REFRESH_ACCOUNTS_INTERVAL_MS,
    );

    unmount();
    expect(unsubscribe).toHaveBeenCalledOnce();
  });
});
