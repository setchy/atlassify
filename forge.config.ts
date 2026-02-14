import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from '@electron-forge/maker-dmg';
import MakerRpm from '@electron-forge/maker-rpm';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import MakerZIP from '@electron-forge/maker-zip';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { PublisherGithub } from '@electron-forge/publisher-github';
import type { ForgeConfig } from '@electron-forge/shared-types';

import { copyTwemojiAssets } from './scripts/twemoji';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'Atlassify',
    appBundleId: 'com.electron.atlassify',
    appCopyright: 'Copyright © 2026 Adam Setch',
    appCategoryType: 'public.app-category.developer-tools',
    asar: true,
    icon: 'assets/images/app-icon',
    // extraResource: ['assets'],
    osxSign: {},
    osxNotarize:
      process.env.NOTARIZE === 'true' &&
      process.env.APPLE_ID &&
      process.env.APPLE_ID_PASSWORD &&
      process.env.APPLE_TEAM_ID
        ? {
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_ID_PASSWORD,
            teamId: process.env.APPLE_TEAM_ID,
          }
        : undefined,
  },
  rebuildConfig: {},
  makers: [
    new MakerDMG(
      {
        icon: 'assets/images/app-icon.icns',
        overwrite: true,
      },
      ['darwin'],
    ),
    new MakerZIP(
      {
        macUpdateManifestBaseUrl:
          'https://github.com/setchy/atlassify/releases/latest/download',
      },
      ['darwin'],
    ),
    new MakerSquirrel(
      {
        name: 'Atlassify',
        setupIcon: 'assets/images/app-icon.ico',
        iconUrl:
          'https://raw.githubusercontent.com/setchy/atlassify/main/assets/images/app-icon.ico',
      },
      ['win32'],
    ),
    new MakerDeb(
      {
        options: {
          name: 'atlassify',
          productName: 'Atlassify',
          genericName: 'Atlassify',
          categories: ['Development'],
          maintainer: 'Adam Setch',
          homepage: 'https://atlassify.io',
        },
      },
      ['linux'],
    ),
    new MakerRpm(
      {
        options: {
          name: 'atlassify',
          productName: 'Atlassify',
          genericName: 'Atlassify',
          categories: ['Development'],
          homepage: 'https://atlassify.io',
        },
      },
      ['linux'],
    ),
  ],
  publishers: [
    new PublisherGithub({
      repository: {
        owner: 'setchy',
        name: 'atlassify',
      },
      draft: true,
      prerelease: false,
      generateReleaseNotes: true,
      force: true,
      authToken: process.env.GITHUB_TOKEN,
    }),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be
      // Main process, Preload scripts, Worker process, etc.
      build: [
        {
          // `entry` is an alias for `build.lib.entry`
          // in the corresponding file of `config`.
          entry: 'src/main/index.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/index.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
  hooks: {
    generateAssets: async () => {
      await copyTwemojiAssets();
    },
  },
};

export default config;
