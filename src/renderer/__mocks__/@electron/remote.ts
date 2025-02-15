let instance: BrowserWindow | null = null;

class BrowserWindow {
  constructor() {
    if (!instance) {
      instance = this;
    }
  }

  loadURL = vi.fn();
  webContents = {
    on: vi.fn(),
    session: {
      clearStorageData: vi.fn(),
    },
  };

  on = vi.fn();
  close = vi.fn();
  hide = vi.fn();
  destroy = vi.fn();
}

export const dialog = {
  showErrorBox: vi.fn(),
};

export const app = {
  getLoginItemSettings: vi.fn(),
  setLoginItemSettings: vi.fn(),
};

export const getCurrentWindow = vi.fn(() => instance || new BrowserWindow());

export { BrowserWindow };
