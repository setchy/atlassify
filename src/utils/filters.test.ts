import { mockSingleAccountNotifications } from '../__mocks__/notifications-mocks';
import { defaultSettings } from '../context/App';
import type { SettingsState } from '../types';
import {
  getCategoryFilterCount,
  getFilterCount,
  getProductFilterCount,
  getReadStateFilterCount,
} from './filters';

describe('utils/filters.ts', () => {
  describe('filter count', () => {
    it('default filter settings', () => {
      expect(getFilterCount(defaultSettings)).toBe(0);
    });

    it('non-default category filters', () => {
      const settings = {
        ...defaultSettings,
        filterCategories: ['direct'],
      } as SettingsState;
      expect(getFilterCount(settings)).toBe(1);
    });

    it('non-default read state filters', () => {
      const settings = {
        ...defaultSettings,
        filterReadStates: ['read'],
      } as SettingsState;
      expect(getFilterCount(settings)).toBe(1);
    });

    it('non-default product filters', () => {
      const settings = {
        ...defaultSettings,
        filterProducts: ['bitbucket'],
      } as SettingsState;
      expect(getFilterCount(settings)).toBe(1);
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
