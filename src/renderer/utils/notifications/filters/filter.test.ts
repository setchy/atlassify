import { vi } from 'vitest';

import { mockFilterStoreState } from '../../../__helpers__/test-utils';
import { mockAtlassifyNotifications } from '../../../__mocks__/notifications-mocks';

import { filterNotifications, hasActiveFilters } from '.';

// Mock the useFiltersStore
vi.mock('../../../hooks/useFiltersStore', () => ({
  useFiltersStore: {
    getState: vi.fn(),
  },
}));

import { useFiltersStore } from '../../../stores/useFiltersStore';

describe('renderer/utils/notifications/filter.ts', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('filterNotifications', () => {
    it('should filter notifications by engagement state when provided', async () => {
      mockAtlassifyNotifications[0].message = 'Some message';
      mockAtlassifyNotifications[1].message = 'someone mentioned you on a page';

      mockFilterStoreState(useFiltersStore, {
        engagementStates: ['mention'],
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by category when provided', async () => {
      mockAtlassifyNotifications[0].category = 'watching';
      mockAtlassifyNotifications[1].category = 'direct';

      mockFilterStoreState(useFiltersStore, {
        categories: ['direct'],
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by actor when provided', async () => {
      mockAtlassifyNotifications[0].actor.displayName = 'Some user';
      mockAtlassifyNotifications[1].actor.displayName = 'Automation for Jira';

      mockFilterStoreState(useFiltersStore, {
        actors: ['user'],
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[0]]);
    });

    it('should filter notifications by read state when provided', async () => {
      mockAtlassifyNotifications[0].readState = 'read';
      mockAtlassifyNotifications[1].readState = 'unread';

      mockFilterStoreState(useFiltersStore, {
        readStates: ['unread'],
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by product when provided', async () => {
      mockAtlassifyNotifications[0].product.type = 'bitbucket';
      mockAtlassifyNotifications[1].product.type = 'compass';

      mockFilterStoreState(useFiltersStore, {
        products: ['compass'],
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should do nothing if no filters set', async () => {
      mockFilterStoreState(useFiltersStore);

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(2);
    });
  });

  describe('hasActiveFilters', () => {
    it('default filter settings', () => {
      mockFilterStoreState(useFiltersStore);

      expect(hasActiveFilters()).toBe(false);
    });

    it('non-default engagement state filters', () => {
      mockFilterStoreState(useFiltersStore, {
        engagementStates: ['mention'],
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default category filters', () => {
      mockFilterStoreState(useFiltersStore, {
        categories: ['direct'],
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default actor filters', () => {
      mockFilterStoreState(useFiltersStore, {
        actors: ['automation'],
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default read state filters', () => {
      mockFilterStoreState(useFiltersStore, {
        readStates: ['read'],
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default product filters', () => {
      mockFilterStoreState(useFiltersStore, {
        products: ['bitbucket'],
      });

      expect(hasActiveFilters()).toBe(true);
    });
  });
});
