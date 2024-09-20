import { defaultSettings } from '../context/App';
import type { SettingsState } from '../types';
import { hasFiltersSet } from './filters';

describe('utils/filters.ts', () => {
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
});
