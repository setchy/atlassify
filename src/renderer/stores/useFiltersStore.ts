import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Constants } from '../constants';

import type {
  ActorType,
  CategoryType,
  EngagementStateType,
  ProductType,
  ReadStateType,
} from '../types';

/**
 * Settings related to the filtering of notifications within the application.
 */
export interface FiltersState {
  /**
   * The engagement states to filter notifications by.
   */
  engagementStates: EngagementStateType[];

  /**
   * The categories to filter notifications by.
   */
  categories: CategoryType[];

  /**
   * The read states to filter notifications by.
   */
  readStates: ReadStateType[];

  /**
   * The products to filter notifications by.
   */
  products: ProductType[];

  /**
   * The notification actors / authors .
   */
  actors: ActorType[];
}

/**
 * All allowed Filter types.
 * Automatically derived from the FiltersState
 */
export type FilterKey = keyof FiltersState;

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
 * Default filter state
 */
export const defaultFiltersState: FiltersState = {
  engagementStates: [],
  categories: [],
  readStates: [],
  products: [],
  actors: [],
};

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
    },
  ),
);

export default useFiltersStore;
