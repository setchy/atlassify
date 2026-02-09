import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Constants } from '../constants';

import type { FiltersState } from './types';

import { defaultFiltersState } from './defaults';

/**
 * All allowed Filter types.
 * Automatically derived from the FiltersState
 */
type FilterKey = keyof FiltersState;

type UpdateFilter = <K extends FilterKey>(
  key: K,
  value: FiltersState[K][number],
  checked: boolean,
) => void;

interface FilterActions {
  updateFilter: UpdateFilter;
  reset: () => void;
}

type FiltersStore = FiltersState & FilterActions;

/**
 * Atlassify Filters store.
 *
 * Automatically persisted to local storage
 */
export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, _get, store) => ({
      ...defaultFiltersState,

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

      partialize: (state) => ({
        engagementStates: state.engagementStates,
        categories: state.categories,
        actors: state.actors,
        readStates: state.readStates,
        products: state.products,
      }),
    },
  ),
);

export default useFiltersStore;
