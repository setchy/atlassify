import { mockAtlassifyNotifications } from '../../../__mocks__/notifications-mocks';
import { mockSettings } from '../../../__mocks__/state-mocks';
import { defaultSettings } from '../../../context/App';
import type { SettingsState } from '../../../types';
import { filterNotifications, hasAnyFiltersSet } from './filter';

describe('renderer/utils/notifications/filter.ts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('filterNotifications', () => {
    it('should filter notifications by time sensitive when provided', async () => {
      mockAtlassifyNotifications[0].message = 'Some message';
      mockAtlassifyNotifications[1].message = 'someone mentioned you on a page';
      const result = filterNotifications(mockAtlassifyNotifications, {
        ...mockSettings,
        filterTimeSensitive: ['mention'],
      });

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by read state when provided', async () => {
      mockAtlassifyNotifications[0].readState = 'read';
      mockAtlassifyNotifications[1].readState = 'unread';
      const result = filterNotifications(mockAtlassifyNotifications, {
        ...mockSettings,
        filterReadStates: ['unread'],
      });

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by category when provided', async () => {
      mockAtlassifyNotifications[0].category = 'watching';
      mockAtlassifyNotifications[1].category = 'direct';
      const result = filterNotifications(mockAtlassifyNotifications, {
        ...mockSettings,
        filterCategories: ['direct'],
      });

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should filter notifications by product when provided', async () => {
      mockAtlassifyNotifications[0].product.name = 'bitbucket';
      mockAtlassifyNotifications[1].product.name = 'compass';
      const result = filterNotifications(mockAtlassifyNotifications, {
        ...mockSettings,
        filterProducts: ['compass'],
      });

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(1);
      expect(result).toEqual([mockAtlassifyNotifications[1]]);
    });

    it('should do nothing if no filters set', async () => {
      const result = filterNotifications(mockAtlassifyNotifications, {
        ...mockSettings,
      });

      expect(mockAtlassifyNotifications.length).toBe(2);
      expect(result.length).toBe(2);
    });
  });

  describe('hasAnyFiltersSet', () => {
    it('default filter settings', () => {
      expect(hasAnyFiltersSet(defaultSettings)).toBe(false);
    });

    it('non-default time sensitive filters', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        filterTimeSensitive: ['mention'],
      };
      expect(hasAnyFiltersSet(settings)).toBe(true);
    });

    it('non-default category filters', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        filterCategories: ['direct'],
      };
      expect(hasAnyFiltersSet(settings)).toBe(true);
    });

    it('non-default read state filters', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        filterReadStates: ['read'],
      };
      expect(hasAnyFiltersSet(settings)).toBe(true);
    });

    it('non-default product filters', () => {
      const settings: SettingsState = {
        ...defaultSettings,
        filterProducts: ['bitbucket'],
      };
      expect(hasAnyFiltersSet(settings)).toBe(true);
    });
  });
});
