import { mockSingleAccountNotifications } from '../__mocks__/notifications-mocks';
import { defaultSettings } from '../context/App';
import type { SettingsState } from '../types';
import {
  getCategoryFilterCount,
  getProductFilterCount,
  getReadStateFilterCount,
  hasFiltersSet,
} from './filters';

describe('renderer/utils/filters.ts', () => {
  describe('has filters', () => {
    it('default filter settings', () => {
      expect(hasFiltersSet(defaultSettings)).toBe(false);
    });

    it('non-default category filters', () => {
      const settings = {
        ...defaultSettings,
        filterCategories: ['direct'],
      } as SettingsState;
      expect(hasFiltersSet(settings)).toBe(true);
    });

    it('non-default read state filters', () => {
      const settings = {
        ...defaultSettings,
        filterReadStates: ['read'],
      } as SettingsState;
      expect(hasFiltersSet(settings)).toBe(true);
    });

    it('non-default product filters', () => {
      const settings = {
        ...defaultSettings,
        filterProducts: ['bitbucket'],
      } as SettingsState;
      expect(hasFiltersSet(settings)).toBe(true);
    });
  });

  it('filter count - read state', () => {
    expect(
      getReadStateFilterCount(mockSingleAccountNotifications, 'unread'),
    ).toBe(1);
  });

  it('filter count - category', () => {
    expect(
      getCategoryFilterCount(mockSingleAccountNotifications, 'direct'),
    ).toBe(1);
  });

  it('filter count - product', () => {
    expect(
      getProductFilterCount(mockSingleAccountNotifications, 'bitbucket'),
    ).toBe(1);
  });
});
