import { getGlobalTheme, setGlobalTheme } from '@atlaskit/tokens';

import { Theme } from '../types';
import { getTheme, isLightMode, setTheme } from './theme';

vi.mock('@atlaskit/tokens', () => ({
  getGlobalTheme: vi.fn(),
  setGlobalTheme: vi.fn(),
}));

describe('renderer/utils/theme.ts', () => {
  const htmlElement = document.createElement('html');

  const mockGetGlobalTheme = vi.mocked(getGlobalTheme);
  const mockSetGlobalTheme = vi.mocked(setGlobalTheme);

  beforeEach(() => {
    document.querySelector = vi.fn(() => htmlElement);
    vi.clearAllMocks();

    mockGetGlobalTheme.mockReturnValue({ colorMode: 'light' });
  });

  describe('setTheme', () => {
    it('should change to light mode', () => {
      setTheme(Theme.LIGHT);

      expect(mockSetGlobalTheme).toHaveBeenCalledWith({ colorMode: 'light' });
      expect(htmlElement.classList.contains('dark')).toBe(false);
    });

    it('should change to dark mode', () => {
      setTheme(Theme.DARK);

      expect(mockSetGlobalTheme).toHaveBeenCalledWith({ colorMode: 'dark' });
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

      expect(mockSetGlobalTheme).toHaveBeenCalledWith({ colorMode: 'light' });
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

      expect(mockSetGlobalTheme).toHaveBeenCalledWith({ colorMode: 'dark' });
      expect(htmlElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('theme and color mode', () => {
    it('should return light theme when global theme is light', () => {
      mockGetGlobalTheme.mockReturnValue({ colorMode: 'light' });

      expect(getTheme()).toBe(Theme.LIGHT);
      expect(isLightMode()).toBe(true);
    });

    it('should return dark theme when global theme is dark', () => {
      mockGetGlobalTheme.mockReturnValue({ colorMode: 'dark' });

      expect(getTheme()).toBe(Theme.DARK);
      expect(isLightMode()).toBe(false);
    });
  });
});
