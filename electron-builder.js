/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  productName: 'Atlassify',
  appId: 'com.electron.atlassify',
  copyright: 'Copyright © 2026 Adam Setch',
  asar: true,
  /**
   * Hardening switches baked into the packaged Electron binary. electron-builder
   * flips these after packing and before signing, so the code signature covers the
   * flipped binary. Left unset, every switch keeps its permissive Electron default.
   *
   * `scripts/verifyFuses.js` asserts these values against the built artifacts.
   */
  electronFuses: {
    runAsNode: false, // refuses ELECTRON_RUN_AS_NODE
    enableNodeOptionsEnvironmentVariable: false, // ignores NODE_OPTIONS / NODE_EXTRA_CA_CERTS
    enableNodeCliInspectArguments: false, // refuses --inspect and SIGUSR1
    enableEmbeddedAsarIntegrityValidation: true, // validates app.asar before loading it
    onlyLoadAppFromAsar: true, // no fallback to an adjacent app/ directory
    /**
     * Not a fuse: re-applies the ad-hoc macOS signature after flipping. Flipping
     * invalidates the ad-hoc signature Electron ships with, and Apple Silicon
     * refuses to launch a binary whose signature no longer validates. The build
     * workflow packages macOS unsigned (`-c.mac.identity=null`), so without this
     * the arm64 artifact is killed on launch. Signing builds re-sign afterwards,
     * which supersedes the ad-hoc signature.
     */
    resetAdHocDarwinSignature: true,
    // grantFileProtocolExtraPrivileges is deliberately left at its Electron default:
    // the renderer loads index.html over file://, so removing those privileges
    // breaks asset and sound loading.
    // enableCookieEncryption is left at its default: tokens are already encrypted
    // through safeStorage, and Atlassify keeps no cookies worth protecting.
  },
  files: [
    'assets/images/**/*',
    'assets/sounds/**/*',
    'build/**/*',
    'LICENSE',
    'node_modules/**/*', // Ideally we would have !node_modules and let electron-builder prune deps
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
    icon: 'assets/images/app-icon.icns',
    sign: false,
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    icon: 'assets/images/app-icon.ico',
  },
  nsis: {
    oneClick: false,
    uninstallDisplayName: 'Atlassify',
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
