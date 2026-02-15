import { getGlobalTheme, setGlobalTheme } from '@atlaskit/tokens';

import { vi } from 'vitest';

import { Theme } from '../../shared/theme';

import { getTheme, isLightMode, setTheme } from './theme';

vi.mock('@atlaskit/tokens', () => ({
  getGlobalTheme: vi.fn(),
  setGlobalTheme: vi.fn(),
}));

describe('renderer/utils/theme.ts', () => {
  const htmlElement = document.createElement('html');

  beforeEach(() => {
    document.querySelector = vi.fn(() => htmlElement);
    vi.clearAllMocks();
  });

  describe('setTheme', () => {
    it('should change to light mode', () => {
      setTheme(Theme.LIGHT);

      expect(setGlobalTheme).toHaveBeenCalledWith({ colorMode: 'light' });
      expect(htmlElement.classList.contains('dark')).toBe(false);
    });

    it('should change to dark mode', () => {
      setTheme(Theme.DARK);

      expect(setGlobalTheme).toHaveBeenCalledWith({ colorMode: 'dark' });
      expect(htmlElement.classList.contains('dark')).toBe(true);
    });

    it("should use the system's mode - light", () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((_query) => ({
          matches: false,
        })),
      });

      setTheme();

      expect(setGlobalTheme).toHaveBeenCalledWith({ colorMode: 'light' });
      expect(htmlElement.classList.contains('dark')).toBe(false);
    });

    it("should use the system's mode - dark", () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((_query) => ({
          matches: true,
        })),
      });

      setTheme();

      expect(setGlobalTheme).toHaveBeenCalledWith({ colorMode: 'dark' });
      expect(htmlElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('getTheme', () => {
    it('should return light theme when global theme is light', () => {
      vi.mocked(getGlobalTheme).mockReturnValue({ colorMode: 'light' });

      expect(getTheme()).toBe(Theme.LIGHT);
    });

    it('should return dark theme when global theme is dark', () => {
      vi.mocked(getGlobalTheme).mockReturnValue({ colorMode: 'dark' });

      expect(getTheme()).toBe(Theme.DARK);
    });
  });

  describe('isLightMode', () => {
    it('should correctly identify light mode', () => {
      vi.mocked(getGlobalTheme).mockReturnValue({ colorMode: 'light' });

      expect(isLightMode()).toBe(true);
    });

    it('should correctly identify dark mode', () => {
      vi.mocked(getGlobalTheme).mockReturnValue({ colorMode: 'dark' });

      expect(isLightMode()).toBe(false);
    });
  });
});
