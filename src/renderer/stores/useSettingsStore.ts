import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import { Constants } from '../constants';

import { defaultSettings } from '../context/defaults';

import type { SettingsState, SettingsValue } from '../types';

interface SettingsActions {
  updateSetting: (name: keyof SettingsState, value: SettingsValue) => void;
  reset: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

/**
 * Atlassify Settings store.
 *
 * Automatically persisted to local storage
 */
export const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector(
    persist(
      (set, _get, store) => ({
        ...defaultSettings,

        updateSetting: (name, value) => {
          set({ [name]: value });
        },

        reset: () => {
          set(store.getInitialState());
        },
      }),
      {
        name: Constants.SETTINGS_STORE_KEY,

        partialize: (state) => {
          // Exclude actions from persistence
          const { updateSetting, reset, ...persistedState } = state;
          return persistedState;
        },
      },
    ),
  ),
);

export default useSettingsStore;
