import { Menu, MenuItem } from 'electron';
import type { Menubar } from 'menubar';

import MenuBuilder from './menu';

jest.mock('electron', () => ({
  Menu: {
    buildFromTemplate: jest.fn(),
  },
  MenuItem: jest.fn(),
}));

describe('main/menu.ts', () => {
  let menubar: Menubar;
  let menuBuilder: MenuBuilder;

  beforeEach(() => {
    menuBuilder = new MenuBuilder(menubar);
  });

  it('should build menu correctly', () => {
    menuBuilder.buildMenu();
    expect(Menu.buildFromTemplate).toHaveBeenCalledWith(expect.any(Array));
  });

  describe('checkForUpdatesMenuItem', () => {
    it('default menu configuration', () => {
      expect(MenuItem).toHaveBeenCalledWith({
        label: 'Check for updates',
        enabled: true,
        click: expect.any(Function),
      });
    });

    it('should enable menu item', () => {
      menuBuilder.setCheckForUpdatesMenuEnabled(true);
      // biome-ignore lint/complexity/useLiteralKeys: This is a test
      expect(menuBuilder['checkForUpdatesMenuItem'].enabled).toBe(true);
    });

    it('should disable menu item', () => {
      menuBuilder.setCheckForUpdatesMenuEnabled(false);
      // biome-ignore lint/complexity/useLiteralKeys: This is a test
      expect(menuBuilder['checkForUpdatesMenuItem'].enabled).toBe(false);
    });
  });

  describe('noUpdateAvailableMenuItem', () => {
    it('default menu configuration', () => {
      expect(MenuItem).toHaveBeenCalledWith({
        label: 'No updates available',
        enabled: false,
        visible: false,
      });
    });

    it('should show menu item', () => {
      menuBuilder.setNoUpdateAvailableMenuVisibility(true);
      // biome-ignore lint/complexity/useLiteralKeys: This is a test
      expect(menuBuilder['noUpdateAvailableMenuItem'].visible).toBe(true);
    });

    it('should hide  menu item', () => {
      menuBuilder.setNoUpdateAvailableMenuVisibility(false);
      // biome-ignore lint/complexity/useLiteralKeys: This is a test
      expect(menuBuilder['noUpdateAvailableMenuItem'].visible).toBe(false);
    });
  });

  describe('updateAvailableMenuItem', () => {
    it('default menu configuration', () => {
      expect(MenuItem).toHaveBeenCalledWith({
        label: 'An update is available',
        enabled: false,
        visible: false,
      });
    });

    it('should show menu item', () => {
      menuBuilder.setUpdateAvailableMenuVisibility(true);
      // biome-ignore lint/complexity/useLiteralKeys: This is a test
      expect(menuBuilder['updateAvailableMenuItem'].visible).toBe(true);
    });

    it('should hide menu item', () => {
      menuBuilder.setUpdateAvailableMenuVisibility(false);
      // biome-ignore lint/complexity/useLiteralKeys: This is a test
      expect(menuBuilder['updateAvailableMenuItem'].visible).toBe(false);
    });
  });

  describe('updateReadyForInstallMenuItem', () => {
    it('default menu configuration', () => {
      expect(MenuItem).toHaveBeenCalledWith({
        label: 'Restart to install update',
        enabled: true,
        visible: false,
        click: expect.any(Function),
      });
    });

    it('should show menu item', () => {
      menuBuilder.setUpdateReadyForInstallMenuVisibility(true);
      // biome-ignore lint/complexity/useLiteralKeys: This is a test
      expect(menuBuilder['updateReadyForInstallMenuItem'].visible).toBe(true);
    });

    it('should hide menu item', () => {
      menuBuilder.setUpdateReadyForInstallMenuVisibility(false);
      // biome-ignore lint/complexity/useLiteralKeys: This is a test
      expect(menuBuilder['updateReadyForInstallMenuItem'].visible).toBe(false);
    });
  });
});
