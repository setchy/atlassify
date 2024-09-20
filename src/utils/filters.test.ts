import { defaultSettings } from '../context/App';
import type { SettingsState } from '../types';
import { getFilterCount } from './filters';

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
});
