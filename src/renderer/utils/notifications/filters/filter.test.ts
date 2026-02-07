import { vi } from 'vitest';

import { mockAtlassifyNotifications } from '../../../__mocks__/notifications-mocks';

import { defaultFilterSettings } from '../../../context/defaults';

import type { FilterSettingsState } from '../../../types';

import { filterNotifications, hasActiveFilters } from '.';

// Mock the useFiltersStore
vi.mock('../../../hooks/useFiltersStore', () => ({
  useFiltersStore: {
    getState: vi.fn(),
  },
}));

import { useFiltersStore } from '../../../hooks/useFiltersStore';

describe('renderer/utils/notifications/filter.ts', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('filterNotifications', () => {
    it('should filter notifications by engagement state when provided', async () => {
      mockAtlassifyNotifications[0].message = 'Some message';
      mockAtlassifyNotifications[1].message = 'someone mentioned you on a page';

      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        engagementStates: ['mention'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by category when provided', async () => {
      mockAtlassifyNotifications[0].category = 'watching';
      mockAtlassifyNotifications[1].category = 'direct';

      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        categories: ['direct'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by actor when provided', async () => {
      mockAtlassifyNotifications[0].actor.displayName = 'Some user';
      mockAtlassifyNotifications[1].actor.displayName = 'Automation for Jira';

      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        actors: ['user'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[0]]);
    });

    it('should filter notifications by read state when provided', async () => {
      mockAtlassifyNotifications[0].readState = 'read';
      mockAtlassifyNotifications[1].readState = 'unread';

      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        readStates: ['unread'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by product when provided', async () => {
      mockAtlassifyNotifications[0].product.type = 'bitbucket';
      mockAtlassifyNotifications[1].product.type = 'compass';

      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        products: ['compass'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should do nothing if no filters set', async () => {
      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(2);
    });
  });

  describe('hasActiveFilters', () => {
    it('default filter settings', () => {
      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      expect(hasActiveFilters()).toBe(false);
    });

    it('non-default engagement state filters', () => {
      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        engagementStates: ['mention'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default category filters', () => {
      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        categories: ['direct'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default actor filters', () => {
      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        actors: ['automation'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default read state filters', () => {
      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        readStates: ['read'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default product filters', () => {
      vi.mocked(useFiltersStore.getState).mockReturnValue({
        ...defaultFilterSettings,
        products: ['bitbucket'],
      } as FilterSettingsState & {
        setFilters: any;
        updateFilter: any;
        clearFilters: any;
      });

      expect(hasActiveFilters()).toBe(true);
    });
  });
});
