/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  productName: 'Atlassify',
  appId: 'com.electron.atlassify',
  copyright: 'Copyright © 2025 Adam Setch',
  asar: true,
  files: [
    'assets/images/*',
    'assets/sounds/*',
    'build/**/*',
    'LICENSE',
    'node_modules/**/*',
    'package.json',
  ],
  electronLanguages: ['en'],
  mac: {
    category: 'public.app-category.developer-tools',
    icon: 'assets/images/app-icon.icns',
    identity: 'Adam Setch (5KD23H9729)',
    type: 'distribution',
    notarize: false, // Handle notarization in afterSign.js
    target: {
      target: 'default',
      arch: ['universal', 'arm64', 'x64'],
    },
    hardenedRuntime: true,
    entitlements: 'assets/entitlements.mac.plist',
    entitlementsInherit: 'assets/entitlements.mac.plist',
    gatekeeperAssess: false,
  },
  dmg: {
    sign: false,
    icon: 'assets/images/app-icon.icns',
  },
  win: {
    target: 'nsis',
    icon: 'assets/images/app-icon.ico',
  },
  nsis: {
    oneClick: false,
  },
  linux: {
    target: ['AppImage', 'deb', 'rpm'],
    category: 'Productivity',
    maintainer: 'Adam Setch',
  },
  publish: {
    provider: 'github',
    owner: 'setchy',
    repo: 'atlassify',
  },
  afterSign: 'scripts/afterSign.js',
  afterPack: 'scripts/afterPack.js',
};

module.exports = config;
