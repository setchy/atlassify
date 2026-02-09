import { act, renderHook } from '@testing-library/react';

import useFiltersStore from './useFiltersStore';
import { defaultFiltersState } from './defaults';

describe('useFiltersStore', () => {
  beforeEach(() => {
    useFiltersStore.setState(defaultFiltersState);
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

    expect(result.current).toMatchObject(defaultFiltersState);
  });
});
