// /**
//  * @typedef {import('../../preload/types.ts').AtlassifyAPI} AtlassifyAPI
//  */

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

// /** @type {AtlassifyAPI} */
// const mockAtlassifyAPI = {
// 	openExternalLink: jest.fn(),
// 	decryptValue: () => Promise.resolve("decrypted"),
// 	encryptValue: () => Promise.resolve("encrypted"),
// 	platform: {
// 		isLinux: () => false,
// 		isMacOS: () => true,
// 		isWindows: () => false,
// 	},
// 	app: {
// 		hide: jest.fn(),
// 		show: jest.fn(),
// 		quit: jest.fn(),
// 		version: () => Promise.resolve("0.0.1"),
// 	},
// 	zoom: {
// 		getLevel: jest.fn(),
// 		setLevel: jest.fn(),
// 	},
// 	tray: {
// 		updateIcon: jest.fn(),
// 		updateTitle: jest.fn(),
// 		useAlternateIdleIcon: jest.fn(),
// 	},
// 	twemojiDirectory: jest.fn(),
// };

// window.atlassify = mockAtlassifyAPI;

// window.atlassify.decryptValue = Promise.resolve("decrypted");
// window.atlassify.twemojiDirectory = Promise.resolve("/tmp/emoji");

window.atlassify.app = {
  version: Promise.resolve('0.0.1'),
};
