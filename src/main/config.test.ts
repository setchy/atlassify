import { describe, expect, it, vi } from 'vitest';

vi.mock('./utils', () => ({
  isDevMode: vi.fn().mockReturnValue(false),
}));

vi.mock('electron', () => ({
  app: {
    isPackaged: true,
  },
}));

describe('main/config.ts', () => {
  it('exports Paths object with expected properties', async () => {
    const { Paths } = await import('./config');

    expect(Paths.preload).toBeDefined();
    expect(Paths.preload).toContain('preload.js');

    expect(Paths.indexHtml).toBeDefined();
    expect(Paths.indexHtml).toContain('index.html');

    expect(Paths.notificationSound).toBeDefined();
    expect(Paths.notificationSound).toContain('.wav');

    expect(Paths.twemojiFolder).toBeDefined();
    expect(Paths.twemojiFolder).toContain('twemoji');
  });

  it('exports WindowConfig with expected properties', async () => {
    const { WindowConfig } = await import('./config');

    expect(WindowConfig.width).toBe(500);
    expect(WindowConfig.height).toBe(400);
    expect(WindowConfig.minWidth).toBe(500);
    expect(WindowConfig.minHeight).toBe(400);
    expect(WindowConfig.resizable).toBe(false);
    expect(WindowConfig.skipTaskbar).toBe(true);
    expect(WindowConfig.webPreferences).toBeDefined();
    expect(WindowConfig.webPreferences.contextIsolation).toBe(true);
    expect(WindowConfig.webPreferences.nodeIntegration).toBe(false);
  });
});
