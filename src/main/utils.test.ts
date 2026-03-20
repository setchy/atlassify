import path from 'node:path';

import type { Menubar } from 'menubar';

const isPackagedMock = vi.fn();
vi.mock('electron', () => ({
  app: {
    isPackaged: () => isPackagedMock(),
  },
  shell: { openPath: vi.fn(() => Promise.resolve('')) },
}));

const writeFile = vi.fn((_p: string, _d: unknown, cb: () => void) => cb());
vi.mock('node:fs', () => ({
  default: {
    writeFile: (p: string, d: unknown, cb: () => void) => writeFile(p, d, cb),
  },
  writeFile: (p: string, d: unknown, cb: () => void) => writeFile(p, d, cb),
}));

const homedir = vi.fn(() => '/home/test');
vi.mock('node:os', () => ({
  default: { homedir: () => homedir() },
  homedir: () => homedir(),
}));

const fileGetFileMock = vi.fn(() => ({ path: '/var/log/app/app.log' }));
vi.mock('electron-log', () => ({
  default: {
    transports: {
      file: { getFile: () => fileGetFileMock() },
    },
  },
  transports: {
    file: { getFile: () => fileGetFileMock() },
  },
}));

const logInfoMock = vi.fn();
const logErrorMock = vi.fn();

vi.mock('../shared/logger', () => ({
  logInfo: (...a: unknown[]) => logInfoMock(...a),
  logError: (...a: unknown[]) => logErrorMock(...a),
}));

import { shell } from 'electron';

import { openLogsDirectory, takeScreenshot } from './utils';

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
    fileGetFileMock.mockReturnValue({ path: '/var/log/app/app.log' });
  });

  it('takeScreenshot writes file and logs info', async () => {
    const mb = createMb();
    await takeScreenshot(mb as unknown as Menubar);
    expect(writeFile).toHaveBeenCalled();
    const writtenPath = (writeFile.mock.calls[0] as unknown[])[0] as string;
    expect(writtenPath.startsWith(path.join('/home/test'))).toBe(true);
    expect(logInfoMock).toHaveBeenCalledWith(
      'takeScreenshot',
      expect.stringContaining('Screenshot saved'),
    );
  });

  it('openLogsDirectory opens directory when present', () => {
    openLogsDirectory();
    expect(shell.openPath).toHaveBeenCalledWith('/var/log/app');
    expect(logErrorMock).not.toHaveBeenCalled();
  });

  it('openLogsDirectory logs error when no directory', () => {
    fileGetFileMock.mockReturnValue(null);
    openLogsDirectory();
    expect(logErrorMock).toHaveBeenCalledWith(
      'openLogsDirectory',
      'Could not find log directory!',
      expect.any(Error),
    );
  });
});
