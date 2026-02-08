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

export const defaultFiltersState: FiltersState = {
  engagementStates: [],
  categories: [],
  readStates: [],
  products: [],
  actors: [],
};

interface FilterActions {
  updateFilter: (
    key: keyof FiltersState,
    value: any,
    checked?: boolean,
  ) => void;

  reset: () => void;
}

type FiltersStore = FiltersState & FilterActions;

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set, get, store) => ({
      ...defaultFiltersState,

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
