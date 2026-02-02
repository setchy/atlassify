import { vi } from 'vitest';

import path from 'node:path';

const writeFile = vi.fn((_p: string, _d: unknown, cb: () => void) => cb());
vi.mock('node:fs', () => ({
  writeFile: (p: string, d: unknown, cb: () => void) => writeFile(p, d, cb),
}));

const homedir = vi.fn(() => '/home/test');
vi.mock('node:os', () => ({ homedir: () => homedir() }));

vi.mock('electron', () => ({
  dialog: { showMessageBoxSync: vi.fn() },
  shell: { openPath: vi.fn() },
}));

vi.mock('electron-log', () => ({
  transports: {
    file: { getFile: () => ({ path: '/var/log/app/app.log' }) },
  },
}));

const logInfoMock = vi.fn();
const logErrorMock = vi.fn();

vi.mock('../shared/logger', () => ({
  logInfo: (...a: unknown[]) => logInfoMock(...a),
  logError: (...a: unknown[]) => logErrorMock(...a),
}));

const sendRendererEventMock = vi.fn();
vi.mock('./events', () => ({
  sendRendererEvent: (...a: unknown[]) => sendRendererEventMock(...a),
}));

import { dialog, shell } from 'electron';

import { openLogsDirectory, resetApp, takeScreenshot } from './utils';

function createMb() {
  return {
    window: {
      capturePage: () =>
        Promise.resolve({ toPNG: () => Buffer.from('image-bytes') }),
    },
    app: { quit: vi.fn() },
  };
}

describe('main/utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('takeScreenshot writes file and logs info', async () => {
    const mb = createMb();
    await takeScreenshot(mb as unknown as import('menubar').Menubar);
    expect(writeFile).toHaveBeenCalled();
    const writtenPath = (writeFile.mock.calls[0] as unknown[])[0] as string;
    expect(writtenPath.startsWith(path.join('/home/test'))).toBe(true);
    expect(logInfoMock).toHaveBeenCalledWith(
      'takeScreenshot',
      expect.stringContaining('Screenshot saved'),
    );
  });

  it('resetApp sends event and quits on confirm', () => {
    (dialog.showMessageBoxSync as any).mockReturnValue(1);
    const mb = createMb();
    resetApp(mb as unknown as import('menubar').Menubar);
    expect(sendRendererEventMock).toHaveBeenCalledWith(
      mb,
      'atlassify:reset-app',
    );
    expect(mb.app.quit).toHaveBeenCalled();
  });

  it('resetApp does nothing on cancel', () => {
    (dialog.showMessageBoxSync as any).mockReturnValue(0);
    const mb = createMb();
    resetApp(mb as unknown as import('menubar').Menubar);
    expect(sendRendererEventMock).not.toHaveBeenCalled();
    expect(mb.app.quit).not.toHaveBeenCalled();
  });

  it('openLogsDirectory opens directory when present', () => {
    openLogsDirectory();
    expect(shell.openPath).toHaveBeenCalledWith('/var/log/app');
    expect(logErrorMock).not.toHaveBeenCalled();
  });

  it('openLogsDirectory logs error when no directory', () => {
    (fileTransport as { getFile: () => { path: string } | null }).getFile =
      () => null;
    vi.resetModules();
    const { openLogsDirectory: openLogsDirectoryReloaded } = require('./utils');
    openLogsDirectoryReloaded();
    expect(logErrorMock).toHaveBeenCalledWith(
      'openLogsDirectory',
      'Could not find log directory!',
      expect.any(Error),
    );
  });
});
