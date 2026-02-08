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

/**
 * All allowed Filter values to be stored in the application.
 * Automatically derived from the array element types in FiltersState.
 */
export type FilterValue = FiltersState[keyof FiltersState][number];

export const defaultFiltersState: FiltersState = {
  engagementStates: [],
  categories: [],
  readStates: [],
  products: [],
  actors: [],
};

interface FilterActions {
  updateFilter: (key: FilterKey, value: FilterValue, checked: boolean) => void;

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
