import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { defaultFilterSettings } from '../context/defaults';

import type { FilterSettingsState } from '../types';

interface FilterActions {
  setFilters: (next: FilterSettingsState) => void;
  updateFilter: (
    key: keyof FilterSettingsState,
    value: any,
    checked?: boolean,
  ) => void;
  clearFilters: () => void;
}

export const useFiltersStore = create<FilterSettingsState & FilterActions>()(
  persist(
    (set, get, store) => ({
      ...defaultFilterSettings,

      setFilters: (next) => {
        set(next);
      },

      updateFilter: (key, value, checked) => {
        const current = (get() as any)[key] || [];
        const updated =
          typeof checked === 'boolean'
            ? checked
              ? [...current, value]
              : current.filter((item: any) => item !== value)
            : value;

        set({ [key]: updated });
      },

      clearFilters: () => {
        set(store.getInitialState());
      },
    }),
    {
      name: 'atlassify-filters',

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
