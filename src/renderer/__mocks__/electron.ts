import { namespacedEvent } from '../../shared/events';

// Mock `window.Notification`
vi.stubGlobal('Notification', function (title: string) {
  this.title = title;
  return {
    onclick: vi.fn(),
  };
});

// Mock `window.Audio`
vi.stubGlobal(
  'Audio',
  class Audio {
    path: string;
    constructor(path: string) {
      this.path = path;
    }
    play() {}
  },
);

// Mock `window.localStorage`
vi.stubGlobal('localStorage', {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorage.store[key] || null),
  setItem: vi.fn((key: string, item: string) => {
    localStorage.store[key] = item;
  }),
  removeItem: vi.fn(),
});

// Mock `window.alert`
vi.stubGlobal('alert', vi.fn());

export const ipcRenderer = {
  send: vi.fn(),
  on: vi.fn(),
  sendSync: vi.fn(),
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  invoke: vi.fn((channel: string, ..._args: any[]) => {
    switch (channel) {
      case 'get-platform':
        return Promise.resolve('darwin');
      case namespacedEvent('version'):
        return Promise.resolve('0.0.1');
      case namespacedEvent('safe-storage-encrypt'):
        return Promise.resolve('encrypted');
      case namespacedEvent('safe-storage-decrypt'):
        return Promise.resolve('decrypted');
      default:
        return Promise.reject(new Error(`Unknown channel: ${channel}`));
    }
  }),
};

export const shell = {
  openExternal: vi.fn(),
};

export const webFrame = {
  setZoomLevel: vi.fn(),
  getZoomLevel: vi.fn(),
};
