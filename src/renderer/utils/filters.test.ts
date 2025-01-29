import { mockSingleAccountNotifications } from '../__mocks__/notifications-mocks';
import { defaultSettings } from '../context/App';
import type { SettingsState } from '../types';
import {
  FILTERS_TIME_SENSITIVE,
  getCategoryFilterCount,
  getProductFilterCount,
  getReadStateFilterCount,
  getTimeSensitiveFilterCount,
  hasAnyFiltersSet,
} from './filters';

describe('renderer/utils/filters.ts', () => {
  describe('has filters', () => {
    it('default filter settings', () => {
      expect(hasAnyFiltersSet(defaultSettings)).toBe(false);
    });

    it('non-default time sensitive filters', () => {
      const settings = {
        ...defaultSettings,
        filterTimeSensitive: ['mention'],
      } as SettingsState;
      expect(hasAnyFiltersSet(settings)).toBe(true);
    });

    it('non-default category filters', () => {
      const settings = {
        ...defaultSettings,
        filterCategories: ['direct'],
      } as SettingsState;
      expect(hasAnyFiltersSet(settings)).toBe(true);
    });

    it('non-default read state filters', () => {
      const settings = {
        ...defaultSettings,
        filterReadStates: ['read'],
      } as SettingsState;
      expect(hasAnyFiltersSet(settings)).toBe(true);
    });

    it('non-default product filters', () => {
      const settings = {
        ...defaultSettings,
        filterProducts: ['bitbucket'],
      } as SettingsState;
      expect(hasAnyFiltersSet(settings)).toBe(true);
    });
  });

  describe('filter counts', () => {
    it('time sensitive', () => {
      expect(
        getTimeSensitiveFilterCount(
          mockSingleAccountNotifications,
          FILTERS_TIME_SENSITIVE.mention,
        ),
      ).toBe(0);
    });

    it('read state', () => {
      expect(
        getReadStateFilterCount(mockSingleAccountNotifications, 'unread'),
      ).toBe(1);
    });

    it('category', () => {
      expect(
        getCategoryFilterCount(mockSingleAccountNotifications, 'direct'),
      ).toBe(1);
    });

    it('product', () => {
      expect(
        getProductFilterCount(mockSingleAccountNotifications, 'bitbucket'),
      ).toBe(1);
    });
  });
});
