describe('main/icons', () => {
  const originalPlatform = process.platform;

  function mockPlatform(value: NodeJS.Platform) {
    Object.defineProperty(process, 'platform', { value });
  }

  afterAll(() => {
    mockPlatform(originalPlatform as NodeJS.Platform);
  });

  it('returns correct icon path for macOS', async () => {
    mockPlatform('darwin');
    const iconsModule = await import('./icons');
    expect(iconsModule.getIconPath('icon-mac.png')).toMatch(/icon-mac\.png$/);
  });

  it('returns correct icon path for Windows', async () => {
    mockPlatform('win32');
    const iconsModule = await import('./icons');
    expect(iconsModule.getIconPath('icon-win.ico')).toMatch(/icon-win\.ico$/);
  });

  it('returns correct icon path for Linux', async () => {
    mockPlatform('linux');
    const iconsModule = await import('./icons');
    expect(iconsModule.getIconPath('icon-linux.png')).toMatch(
      /icon-linux\.png$/,
    );
  });
});

import { TrayIcons } from './icons';

describe('main/icons.ts', () => {
  it('should return icon images', () => {
    expect(TrayIcons.active).toContain('assets/images/tray-active.png');

    expect(TrayIcons.idle).toContain('assets/images/tray-idleTemplate.png');

    expect(TrayIcons.idleAlternate).toContain(
      'assets/images/tray-idle-white.png',
    );

    expect(TrayIcons.error).toContain('assets/images/tray-error.png');

    expect(TrayIcons.offline).toContain('assets/images/tray-offline.png');
  });
});
