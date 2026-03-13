import { act, renderHook } from '@testing-library/react';

import { useAccountsStore, useFiltersStore, useSettingsStore } from '../stores';

import { useAppReset } from './useAppReset';

describe('renderer/hooks/useAppReset.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resets all persisted stores when the onResetApp IPC event fires', () => {
    const resetAccounts = vi.spyOn(useAccountsStore.getState(), 'reset');
    const resetSettings = vi.spyOn(useSettingsStore.getState(), 'reset');
    const resetFilters = vi.spyOn(useFiltersStore.getState(), 'reset');

    renderHook(() => useAppReset());

    const registeredCallback = vi.mocked(window.atlassify.onResetApp).mock
      .calls[0][0];

    act(() => {
      registeredCallback();
    });

    expect(resetAccounts).toHaveBeenCalledOnce();
    expect(resetSettings).toHaveBeenCalledOnce();
    expect(resetFilters).toHaveBeenCalledOnce();
  });
});
