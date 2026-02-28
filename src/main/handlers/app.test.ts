import { beforeEach, describe, expect, it, vi } from 'vitest';

const handleMock = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    handle: (...args: unknown[]) => handleMock(...args),
  },
  app: {
    getVersion: vi.fn(() => '1.0.0'),
  },
}));

vi.mock('@aptabase/electron/main', () => ({
  trackEvent: vi.fn(),
}));

vi.mock('../config', () => ({
  Paths: {
    notificationSound: 'file:///path/to/notification.wav',
    twemojiFolder: 'file:///path/to/twemoji',
  },
}));

describe('main/handlers/app.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    handleMock.mockClear();
  });

  it('registers handlers without throwing', async () => {
    const { registerAppHandlers } = await import('./app');

    expect(() => registerAppHandlers()).not.toThrow();
  });

  it('registers VERSION, NOTIFICATION_SOUND_PATH, TWEMOJI_DIRECTORY, and APTABASE_TRACK_EVENT handlers', async () => {
    const { registerAppHandlers } = await import('./app');

    registerAppHandlers();

    const registeredHandlers = handleMock.mock.calls.map(
      (call: [string]) => call[0],
    );

    expect(registeredHandlers).toContain('atlassify:version');
    expect(registeredHandlers).toContain('atlassify:notification-sound-path');
    expect(registeredHandlers).toContain('atlassify:twemoji-directory');
    expect(registeredHandlers).toContain('atlassify:aptabase-track-event');
  });
});
