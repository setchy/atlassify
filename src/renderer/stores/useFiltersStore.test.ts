import { act, renderHook } from '@testing-library/react';

import { DEFAULT_FILTERS_STATE } from './defaults';
import { useFiltersStore } from './useFiltersStore';

describe('useFiltersStore', () => {
  test('should start with default filters', () => {
    const { result } = renderHook(() => useFiltersStore());

    expect(result.current).toMatchObject(DEFAULT_FILTERS_STATE);
  });

  test('should update a filter (add value)', () => {
    const { result } = renderHook(() => useFiltersStore());

    act(() => {
      result.current.updateFilter('categories', 'direct', true);
    });

    expect(result.current.categories).toContain('direct');
  });

  test('should update a filter (remove value)', () => {
    const { result } = renderHook(() => useFiltersStore());

    act(() => {
      result.current.updateFilter('categories', 'direct', true);
      result.current.updateFilter('categories', 'direct', false);
    });

    expect(result.current.categories).not.toContain('direct');
  });

  test('should reset filters to default', () => {
    const { result } = renderHook(() => useFiltersStore());

    act(() => {
      result.current.updateFilter('products', 'jira', true);
      result.current.reset();
    });

    expect(result.current).toMatchObject(DEFAULT_FILTERS_STATE);
  });

  describe('hasActiveFilters', () => {
    it('default filter settings', () => {
      expect(useFiltersStore.getState().hasActiveFilters()).toBe(false);
    });

    it('non-default engagement state filters', () => {
      useFiltersStore.setState({ engagementStates: ['mention'] });

      expect(useFiltersStore.getState().hasActiveFilters()).toBe(true);
    });

    it('non-default category filters', () => {
      useFiltersStore.setState({ categories: ['direct'] });

      expect(useFiltersStore.getState().hasActiveFilters()).toBe(true);
    });

    it('non-default actor filters', () => {
      useFiltersStore.setState({ actors: ['automation'] });

      expect(useFiltersStore.getState().hasActiveFilters()).toBe(true);
    });

    it('non-default read state filters', () => {
      useFiltersStore.setState({ readStates: ['read'] });

      expect(useFiltersStore.getState().hasActiveFilters()).toBe(true);
    });

    it('non-default product filters', () => {
      useFiltersStore.setState({ products: ['bitbucket'] });

      expect(useFiltersStore.getState().hasActiveFilters()).toBe(true);
    });
  });
});
