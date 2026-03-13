import { useEffect } from 'react';

import { useAccountsStore, useFiltersStore, useSettingsStore } from '../stores';

/**
 * Coordinates a full application reset across all persisted Zustand stores.
 *
 * Listens for the `onResetApp` IPC event from the main process and resets
 * accounts, settings, and filters stores to their initial state.
 *
 * To add a new store to the reset flow, import its reset selector here.
 */
export function useAppReset(): void {
  const resetAccounts = useAccountsStore((s) => s.reset);
  const resetFilters = useFiltersStore((s) => s.reset);
  const resetSettings = useSettingsStore((s) => s.reset);

  useEffect(() => {
    window.atlassify.onResetApp(() => {
      resetAccounts();
      resetSettings();
      resetFilters();
    });
  }, [resetAccounts, resetSettings, resetFilters]);
}
