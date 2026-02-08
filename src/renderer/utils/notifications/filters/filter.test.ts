import { vi } from 'vitest';

import { mockAtlassifyNotifications } from '../../../__mocks__/notifications-mocks';

import useFiltersStore, {
  defaultFiltersState,
} from '../../../stores/useFiltersStore';
import { filterNotifications, hasActiveFilters } from '.';

describe('renderer/utils/notifications/filter.ts', () => {
  beforeEach(() => {
    useFiltersStore.getState().reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('filterNotifications', () => {
    it('should filter notifications by engagement state when provided', async () => {
      mockAtlassifyNotifications[0].message = 'Some message';
      mockAtlassifyNotifications[1].message = 'someone mentioned you on a page';

      useFiltersStore.setState({
        ...defaultFiltersState,
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

      useFiltersStore.setState({
        ...defaultFiltersState,
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

      useFiltersStore.setState({
        ...defaultFiltersState,
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

      useFiltersStore.setState({
        ...defaultFiltersState,
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

      useFiltersStore.setState({
        ...defaultFiltersState,
        products: ['compass'],
      });

      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should do nothing if no filters set', async () => {
      const result = filterNotifications(mockAtlassifyNotifications);

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(2);
    });
  });

  describe('hasActiveFilters', () => {
    it('default filter settings', () => {
      expect(hasActiveFilters()).toBe(false);
    });

    it('non-default engagement state filters', () => {
      useFiltersStore.setState({
        ...defaultFiltersState,
        engagementStates: ['mention'],
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default category filters', () => {
      useFiltersStore.setState({
        ...defaultFiltersState,
        categories: ['direct'],
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default actor filters', () => {
      useFiltersStore.setState({
        ...defaultFiltersState,
        actors: ['automation'],
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default read state filters', () => {
      useFiltersStore.setState({
        ...defaultFiltersState,
        readStates: ['read'],
      });

      expect(hasActiveFilters()).toBe(true);
    });

    it('non-default product filters', () => {
      useFiltersStore.setState({
        ...defaultFiltersState,
        products: ['bitbucket'],
      });

      expect(hasActiveFilters()).toBe(true);
    });
  });
});
