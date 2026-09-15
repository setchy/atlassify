import fs from 'node:fs';
import path from 'node:path';

import {
  applyOzonePlatform,
  isX11BackendEnabled,
  setX11Backend,
} from './ozone';

const USER_DATA = '/tmp/atlassify-test-userdata';
const MARKER = path.join(USER_DATA, 'UseX11Backend');
const appendSwitchMock = vi.fn();

vi.mock('electron', () => ({
  app: {
    getPath: (name: string) =>
      name === 'userData' ? '/tmp/atlassify-test-userdata' : '',
    commandLine: {
      appendSwitch: (...args: unknown[]) => appendSwitchMock(...args),
    },
  },
}));

const logErrorMock = vi.fn();
vi.mock('../shared/logger', () => ({
  logError: (...args: unknown[]) => logErrorMock(...args),
  logInfo: vi.fn(),
  toError: (error: unknown) => error,
}));

function setPlatform(platform: NodeJS.Platform): void {
  Object.defineProperty(process, 'platform', {
    value: platform,
    configurable: true,
  });
}

describe('main/ozone.ts', () => {
  const realPlatform = process.platform;

  beforeEach(() => {
    vi.clearAllMocks();
    fs.mkdirSync(USER_DATA, { recursive: true });
    fs.rmSync(MARKER, { force: true });
  });

  afterEach(() => {
    setPlatform(realPlatform);
    fs.rmSync(MARKER, { force: true });
  });

  it('round-trips the X11 preference through the marker file', () => {
    expect(isX11BackendEnabled()).toBe(false);

    setX11Backend(true);
    expect(isX11BackendEnabled()).toBe(true);

    setX11Backend(false);
    expect(isX11BackendEnabled()).toBe(false);
  });

  it('logs and swallows marker file errors', () => {
    const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error('EACCES');
    });

    expect(() => setX11Backend(true)).not.toThrow();
    expect(logErrorMock).toHaveBeenCalled();

    writeSpy.mockRestore();
  });

  it('forces X11 and disables Vulkan on Linux when enabled', () => {
    setPlatform('linux');
    setX11Backend(true);

    applyOzonePlatform();

    expect(appendSwitchMock).toHaveBeenCalledWith('ozone-platform', 'x11');
    expect(appendSwitchMock).toHaveBeenCalledWith('disable-features', 'Vulkan');
  });

  it.each(['linux', 'darwin', 'win32'] as const)(
    'does not alter switches when disabled or unsupported on %s',
    (platform) => {
      setPlatform(platform);
      if (platform !== 'linux') {
        setX11Backend(true);
      }

      applyOzonePlatform();

      expect(appendSwitchMock).not.toHaveBeenCalled();
    },
  );
});
