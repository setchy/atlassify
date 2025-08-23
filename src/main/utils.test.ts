import path from 'node:path';

const writeFile = jest.fn((_p: string, _d: unknown, cb: () => void) => cb());
jest.mock('node:fs', () => ({
  writeFile: (p: string, d: unknown, cb: () => void) => writeFile(p, d, cb),
}));

const homedir = jest.fn(() => '/home/test');
jest.mock('node:os', () => ({ homedir: () => homedir() }));

jest.mock('electron', () => ({
  dialog: { showMessageBoxSync: jest.fn() },
  shell: { openPath: jest.fn() },
}));

const fileTransport = { getFile: () => ({ path: '/var/log/app/app.log' }) };
const logTransports: { file: { getFile: () => { path: string } | null } } = {
  file: fileTransport,
};
const logInfo = jest.fn();
const logError = jest.fn();

jest.mock('electron-log', () => ({ transports: logTransports }));
jest.mock('../shared/logger', () => ({
  logInfo: (...a: unknown[]) => logInfo(...a),
  logError: (...a: unknown[]) => logError(...a),
}));

const sendRendererEvent = jest.fn();
jest.mock('./events', () => ({
  sendRendererEvent: (...a: unknown[]) => sendRendererEvent(...a),
}));

import { dialog, shell } from 'electron';

import { openLogsDirectory, resetApp, takeScreenshot } from './utils';

function createMb() {
  return {
    window: {
      capturePage: () =>
        Promise.resolve({ toPNG: () => Buffer.from('image-bytes') }),
    },
    app: { quit: jest.fn() },
  };
}

describe('main/utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('takeScreenshot writes file and logs info', async () => {
    const mb = createMb();
    await takeScreenshot(mb as unknown as import('menubar').Menubar);
    expect(writeFile).toHaveBeenCalled();
    const writtenPath = (writeFile.mock.calls[0] as unknown[])[0] as string;
    expect(writtenPath.startsWith(path.join('/home/test'))).toBe(true);
    expect(logInfo).toHaveBeenCalledWith(
      'takeScreenshot',
      expect.stringContaining('Screenshot saved'),
    );
  });

  it('resetApp sends event and quits on confirm', () => {
    (dialog.showMessageBoxSync as jest.Mock).mockReturnValue(1);
    const mb = createMb();
    resetApp(mb as unknown as import('menubar').Menubar);
    expect(sendRendererEvent).toHaveBeenCalledWith(mb, 'atlassify:reset-app');
    expect(mb.app.quit).toHaveBeenCalled();
  });

  it('resetApp does nothing on cancel', () => {
    (dialog.showMessageBoxSync as jest.Mock).mockReturnValue(0);
    const mb = createMb();
    resetApp(mb as unknown as import('menubar').Menubar);
    expect(sendRendererEvent).not.toHaveBeenCalled();
    expect(mb.app.quit).not.toHaveBeenCalled();
  });

  it('openLogsDirectory opens directory when present', () => {
    openLogsDirectory();
    expect(shell.openPath).toHaveBeenCalledWith('/var/log/app');
    expect(logError).not.toHaveBeenCalled();
  });

  it('openLogsDirectory logs error when no directory', () => {
    (fileTransport as { getFile: () => { path: string } | null }).getFile =
      () => null;
    jest.resetModules();
    const { openLogsDirectory: openLogsDirectoryReloaded } = require('./utils');
    openLogsDirectoryReloaded();
    expect(logError).toHaveBeenCalledWith(
      'openLogsDirectory',
      'Could not find log directory!',
      expect.any(Error),
    );
  });
});
