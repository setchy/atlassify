import './index';

const { calls, menubarOptions, menubarMock, windowConfig } = vi.hoisted(() => ({
  calls: [] as string[],
  menubarOptions: [] as unknown[],
  menubarMock: vi.fn((options: unknown) => {
    menubarOptions.push(options);
    return { window: {} };
  }),
  windowConfig: { width: 500, height: 400 },
}));

vi.mock('electron', () => ({
  app: {
    isPackaged: true,
    whenReady: vi.fn(() => {
      calls.push('whenReady');
      return Promise.resolve();
    }),
  },
}));

vi.mock('electron-log', () => ({
  default: {
    initialize: vi.fn(),
    transports: { file: {} },
  },
}));

vi.mock('electron-menubar', () => ({ menubar: menubarMock }));
vi.mock('./config', () => ({
  Paths: { indexHtml: 'index.html' },
  WindowConfig: windowConfig,
}));
vi.mock('./handlers', () => ({
  initializeAnalytics: vi.fn(),
  registerAnalyticsHandlers: vi.fn(),
  registerAppHandlers: vi.fn(),
  registerStorageHandlers: vi.fn(),
  registerSystemHandlers: vi.fn(),
  registerTrayHandlers: vi.fn(),
}));
vi.mock('./icons', () => ({ TrayIcons: { idle: 'icon.png' } }));
vi.mock('./lifecycle', () => ({
  configureWindowEvents: vi.fn(),
  initializeAppLifecycle: vi.fn(),
  onFirstRunMaybe: vi.fn(),
}));
vi.mock('./menu', () => ({
  default: class {
    buildMenu() {
      return {};
    }
  },
}));
vi.mock('./ozone', () => ({
  applyOzonePlatform: vi.fn(() => calls.push('ozone')),
}));
vi.mock('./updater', () => ({
  default: class {
    start() {}
  },
}));

describe('main/index.ts', () => {
  it('configures electron-menubar to own popup behavior', () => {
    expect(menubarOptions).toEqual([
      {
        icon: 'icon.png',
        index: 'index.html',
        browserWindow: windowConfig,
        preloadWindow: true,
        showDockIcon: false,
        hideOnClose: true,
        escapeToHide: true,
      },
    ]);
  });

  it('applies the Ozone backend before Electron becomes ready', () => {
    expect(calls).toEqual(['ozone', 'whenReady']);
  });

  it('logs an error when Electron fails to become ready', async () => {
    vi.resetModules();
    vi.doMock('electron', () => ({
      app: {
        isPackaged: true,
        whenReady: vi.fn(() => Promise.reject(new Error('ready-failed'))),
      },
    }));
    vi.doMock('../shared/logger', () => ({
      logError: vi.fn(),
      toError: (err: unknown) =>
        err instanceof Error ? err : new Error(String(err)),
    }));

    const { logError } = await import('../shared/logger');

    await import('./index');

    await vi.waitFor(() =>
      expect(logError).toHaveBeenCalledWith(
        'main',
        'Failed to initialize application',
        expect.any(Error),
      ),
    );
  });
});
