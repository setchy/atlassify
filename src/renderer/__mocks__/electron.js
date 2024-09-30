// @ts-ignore
window.Notification = function (title) {
  this.title = title;

  return {
    onclick: jest.fn(),
  };
};

// @ts-ignore
window.Audio = class Audio {
  constructor(path) {
    this.path = path;
  }

  play() {}
};

// @ts-ignore
window.localStorage = {
  store: {},
  getItem: function (key) {
    return this.store[key];
  },
  setItem: function (key, item) {
    this.store[key] = item;
  },
  removeItem: jest.fn(),
};

window.alert = jest.fn();

module.exports = {
  ipcRenderer: {
    send: jest.fn(),
    on: jest.fn(),
    sendSync: jest.fn(),
    invoke: jest.fn((channel, ..._args) => {
      switch (channel) {
        case 'get-platform':
          return Promise.resolve('darwin');
        case 'atlassify:version':
          return Promise.resolve('0.0.1');
        case 'atlassify:safe-storage-encrypt':
          return Promise.resolve('encrypted');
        case 'atlassify:safe-storage-decrypt':
          return Promise.resolve('decrypted');
        default:
          return Promise.reject(new Error(`Unknown channel: ${channel}`));
      }
    }),
  },
  shell: {
    openExternal: jest.fn(),
  },
  webFrame: {
    setZoomLevel: jest.fn(),
    getZoomLevel: jest.fn(),
  },
};