import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Constants } from '../constants';

import type { FiltersStore } from './types';

import { DEFAULT_FILTERS_STATE } from './defaults';

/**
 * Atlassify Filters store.
 *
 * Automatically persisted to local storage
 */
export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, _get, store) => ({
      ...DEFAULT_FILTERS_STATE,

      updateFilter: (key, value, checked) => {
        set((state) => {
          const current = state[key];

          if (checked) {
            return {
              [key]: [...current, value],
            };
          }

          return { [key]: current.filter((item) => item !== value) };
        });
      },

      reset: () => {
        set(store.getInitialState());
      },
    }),
    {
      name: Constants.FILTERS_STORE_KEY,
    },
  ),
);

export default useFiltersStore;
