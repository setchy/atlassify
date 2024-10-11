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

  it('should create menu items correctly', () => {
    expect(MenuItem).toHaveBeenCalledWith({
      label: 'Check for updates',
      enabled: true,
      click: expect.any(Function),
    });

    expect(MenuItem).toHaveBeenCalledWith({
      label: 'An update is available',
      enabled: false,
      visible: false,
    });

    expect(MenuItem).toHaveBeenCalledWith({
      label: 'Restart to update',
      visible: false,
      click: expect.any(Function),
    });
  });

  it('should build menu correctly', () => {
    menuBuilder.buildMenu();
    expect(Menu.buildFromTemplate).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should enable check for updates menu item', () => {
    menuBuilder.setCheckForUpdatesMenuEnabled(true);
    // biome-ignore lint/complexity/useLiteralKeys: This is a test
    expect(menuBuilder['checkForUpdatesMenuItem'].enabled).toBe(true);
  });

  it('should disable check for updates menu item', () => {
    menuBuilder.setCheckForUpdatesMenuEnabled(false);
    // biome-ignore lint/complexity/useLiteralKeys: This is a test
    expect(menuBuilder['checkForUpdatesMenuItem'].enabled).toBe(false);
  });

  it('should enable update available menu item', () => {
    menuBuilder.setUpdateAvailableMenuEnabled(true);
    // biome-ignore lint/complexity/useLiteralKeys: This is a test
    expect(menuBuilder['updateAvailableMenuItem'].enabled).toBe(true);
  });

  it('should disable update available menu item', () => {
    menuBuilder.setUpdateAvailableMenuEnabled(false);
    // biome-ignore lint/complexity/useLiteralKeys: This is a test
    expect(menuBuilder['updateAvailableMenuItem'].enabled).toBe(false);
  });

  it('should enable update ready for install menu item', () => {
    menuBuilder.setUpdateReadyForInstallMenuEnabled(true);
    // biome-ignore lint/complexity/useLiteralKeys: This is a test
    expect(menuBuilder['updateReadyForInstallMenuItem'].enabled).toBe(true);
  });

  it('should disable update ready for install menu item', () => {
    menuBuilder.setUpdateReadyForInstallMenuEnabled(false);
    // biome-ignore lint/complexity/useLiteralKeys: This is a test
    expect(menuBuilder['updateReadyForInstallMenuItem'].enabled).toBe(false);
  });
});
