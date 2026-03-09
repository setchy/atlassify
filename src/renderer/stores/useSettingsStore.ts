import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

import { Constants } from '../constants';

import type { SettingsStore } from './types';

import { DEFAULT_SETTINGS_STATE } from './defaults';

/**
 * Atlassify Settings store.
 *
 * Automatically persisted to local storage
 */
const useSettingsStore = create<SettingsStore>()(
  subscribeWithSelector(
    persist(
      (set, _get, store) => ({
        ...DEFAULT_SETTINGS_STATE,

        /** Updates a single setting value by key. */
        updateSetting: (name, value) => {
          set({ [name]: value });
        },

        /** Toggles a boolean setting. Throws if the setting is not a boolean. */
        toggleSetting: (name) => {
          set((state) => {
            const current = state[name];

            if (typeof current !== 'boolean') {
              throw new Error(
                `toggleSetting: '${String(name)}' is not a boolean setting`,
              );
            }

            return { [name]: !current };
          });
        },

        /** Resets the store to its initial state. */
        reset: () => {
          set(store.getInitialState());
        },
      }),
      {
        name: Constants.STORAGE.SETTINGS,
      },
    ),
  ),
);

export default useSettingsStore;
