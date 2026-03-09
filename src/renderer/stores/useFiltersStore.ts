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
const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, get, store) => ({
      ...DEFAULT_FILTERS_STATE,

      /** Returns `true` if any filter group has one or more active values. */
      hasActiveFilters: () => {
        const state = get();
        return (
          state.engagementStates.length > 0 ||
          state.categories.length > 0 ||
          state.actors.length > 0 ||
          state.readStates.length > 0 ||
          state.products.length > 0
        );
      },

      /** Adds or removes a single filter value for the given filter key based on the `checked` flag. */
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

      /** Resets the store to its initial state, clearing all active filters. */
      reset: () => {
        set(store.getInitialState());
      },
    }),
    {
      name: Constants.STORAGE.FILTERS,
    },
  ),
);

export default useFiltersStore;
