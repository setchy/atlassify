import { getGlobalTheme, setGlobalTheme } from '@atlaskit/tokens';
import { Theme } from '../types';
import { getTheme, isLightMode, setTheme } from './theme';

jest.mock('@atlaskit/tokens', () => ({
  getGlobalTheme: jest.fn(),
  setGlobalTheme: jest.fn(),
}));

describe('renderer/utils/theme.ts', () => {
  const htmlElement = document.createElement('html');

  beforeEach(() => {
    document.querySelector = jest.fn(() => htmlElement);
    jest.clearAllMocks();
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
        value: jest.fn().mockImplementation((_query) => ({
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
        value: jest.fn().mockImplementation((_query) => ({
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
      (getGlobalTheme as jest.Mock).mockReturnValue({ colorMode: 'light' });
      expect(getTheme()).toBe(Theme.LIGHT);
    });

    it('should return dark theme when global theme is dark', () => {
      (getGlobalTheme as jest.Mock).mockReturnValue({ colorMode: 'dark' });
      expect(getTheme()).toBe(Theme.DARK);
    });
  });

  describe('isLightMode', () => {
    it('should correctly identify light mode', () => {
      (getGlobalTheme as jest.Mock).mockReturnValue({ colorMode: 'light' });
      expect(isLightMode()).toBe(true);
    });

    it('should correctly identify dark mode', () => {
      (getGlobalTheme as jest.Mock).mockReturnValue({ colorMode: 'dark' });
      expect(isLightMode()).toBe(false);
    });
  });
});
