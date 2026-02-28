import type { Menubar } from 'menubar';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const onMock = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    on: (...args: unknown[]) => onMock(...args),
  },
}));

vi.mock('../icons', () => ({
  TrayIcons: {
    active: 'active.png',
    idle: 'idle.png',
    idleAlternate: 'idle-alt.png',
    error: 'error.png',
    offline: 'offline.png',
  },
}));

describe('main/handlers/tray.ts', () => {
  let menubar: Menubar;

  beforeEach(() => {
    vi.clearAllMocks();
    onMock.mockClear();

    menubar = {
      showWindow: vi.fn(),
      hideWindow: vi.fn(),
      app: { quit: vi.fn() },
      tray: {
        isDestroyed: vi.fn().mockReturnValue(false),
        setImage: vi.fn(),
        setTitle: vi.fn(),
      },
    } as unknown as Menubar;
  });

  it('registers handlers without throwing', async () => {
    const { registerTrayHandlers } = await import('./tray');

    expect(() => registerTrayHandlers(menubar)).not.toThrow();
  });

  it('registers expected IPC event handlers', async () => {
    const { registerTrayHandlers } = await import('./tray');

    registerTrayHandlers(menubar);

    const registeredEvents = onMock.mock.calls.map((call: [string]) => call[0]);

    expect(registeredEvents).toContain('atlassify:window-show');
    expect(registeredEvents).toContain('atlassify:window-hide');
    expect(registeredEvents).toContain('atlassify:quit');
    expect(registeredEvents).toContain('atlassify:update-icon-color');
    expect(registeredEvents).toContain('atlassify:update-icon-title');
  });
});
