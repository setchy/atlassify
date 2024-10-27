import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import type { Menubar } from 'menubar';
import { updateElectronApp } from 'update-electron-app';

import type MenuBuilder from './menu';

export default class Updater {
  private readonly menubar: Menubar;
  private readonly menuBuilder: MenuBuilder;

  constructor(menubar: Menubar, menuBuilder: MenuBuilder) {
    this.menubar = menubar;
    this.menuBuilder = menuBuilder;
  }

  initialize(): void {
    updateElectronApp({
      updateInterval: '24 hours',
      logger: log,
    });

    autoUpdater.on('checking-for-update', () => {
      log.info('Auto Updater: Checking for update');
      this.menuBuilder.setCheckForUpdatesMenuEnabled(false);
    });

    autoUpdater.on('error', (error) => {
      log.error('Auto Updater: error checking for update', error);
      this.menuBuilder.setCheckForUpdatesMenuEnabled(true);
    });

    autoUpdater.on('update-available', () => {
      log.info('Auto Updater: New update available');
      this.menuBuilder.setUpdateAvailableMenuEnabled(true);
      this.menubar.tray.setToolTip('Atlassify\nA new update is available');
    });

    autoUpdater.on('update-downloaded', () => {
      log.info('Auto Updater: Update downloaded');
      this.menuBuilder.setUpdateReadyForInstallMenuEnabled(true);
      this.menubar.tray.setToolTip(
        'Atlassify\nA new update is ready to install',
      );
    });

    autoUpdater.on('update-not-available', () => {
      log.info('Auto Updater: update not available');
      this.menuBuilder.setCheckForUpdatesMenuEnabled(true);
    });
  }
}
