/**
 * Targets that emitted an artifact, keyed by platform and target name.
 *
 * electron-builder builds every configured target, but a target that packs
 * nothing still leaves a green build. Record what actually produced an
 * artifact and compare it with the planned targets once the build finishes, so
 * the check follows this file without a second list to maintain.
 *
 * @type {Set<string>}
 */
const emittedTargets = new Set();

const targetKey = (platform, target) => `${platform.name}:${target.name}`;

/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  productName: 'Atlassify',
  appId: 'com.electron.atlassify',
  copyright: 'Copyright © 2026 Adam Setch',
  asar: true,
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
  artifactBuildCompleted: (event) => {
    if (event.target != null) {
      emittedTargets.add(targetKey(event.packager.platform, event.target));
    }
  },
  afterAllArtifactBuild: async (buildResult) => {
    const missing = [];

    for (const [platform, nameToTarget] of buildResult.platformToTargets) {
      for (const target of nameToTarget.values()) {
        // `dir` produces the unpacked app, not a distributable to upload.
        if (target.name === 'dir') {
          continue;
        }

        if (!emittedTargets.has(targetKey(platform, target))) {
          missing.push(`${platform.name}/${target.name}`);
        }
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `electron-builder produced no artifact for: ${missing.join(', ')}`,
      );
    }

    return [];
  },
};

module.exports = config;
