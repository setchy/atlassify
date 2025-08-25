import { autoUpdater } from 'electron-updater';
import type { Menubar } from 'menubar';

import { APPLICATION } from '../shared/constants';
import { logError, logInfo } from '../shared/logger';

import type MenuBuilder from './menu';

/**
 * Updater class for handling application updates.
 *
 * Supports scheduled and manual updates for all platforms.
 *
 * NOTE: we previously used update-electron-app, but that expects Squirrel on Windows and doesn't support Linux.
 * Using electron-updater directly ensures cross-platform GitHub provider updates.
 */
export default class Updater {
  private readonly menubar: Menubar;
  private readonly menuBuilder: MenuBuilder;

  constructor(menubar: Menubar, menuBuilder: MenuBuilder) {
    this.menubar = menubar;
    this.menuBuilder = menuBuilder;
  }

  initialize(): void {
    if (!this.menubar.app.isPackaged) {
      logInfo('updater', 'Skipping updater since app is in development mode');
      return;
    }

    logInfo('updater', 'Initializing updater');

    autoUpdater.on('checking-for-update', () => {
      logInfo('auto updater', 'Checking for update');

      this.menuBuilder.setCheckForUpdatesMenuEnabled(false);
      this.menuBuilder.setNoUpdateAvailableMenuVisibility(false);
      // No-op: website item always visible
    });

    autoUpdater.on('update-available', () => {
      logInfo('auto updater', 'New update available');

      this.setTooltipWithStatus('A new update is available');
      this.menuBuilder.setUpdateAvailableMenuVisibility(true);
      // No-op
    });

    autoUpdater.on('download-progress', (progressObj) => {
      this.setTooltipWithStatus(
        `Downloading update: ${progressObj.percent.toFixed(2)}%`,
      );
    });

    autoUpdater.on('update-downloaded', () => {
      logInfo('auto updater', 'Update downloaded');

      this.setTooltipWithStatus('A new update is ready to install');
      this.menuBuilder.setUpdateAvailableMenuVisibility(false);
      this.menuBuilder.setUpdateReadyForInstallMenuVisibility(true);
      // No-op
    });

    autoUpdater.on('update-not-available', () => {
      logInfo('auto updater', 'Update not available');

      this.menuBuilder.setCheckForUpdatesMenuEnabled(true);
      this.menuBuilder.setNoUpdateAvailableMenuVisibility(true);
      this.menuBuilder.setUpdateAvailableMenuVisibility(false);
      this.menuBuilder.setUpdateReadyForInstallMenuVisibility(false);
      // No-op
    });

    autoUpdater.on('update-cancelled', () => {
      logInfo('auto updater', 'Update cancelled');

      this.resetState();
    });

    autoUpdater.on('error', (err) => {
      logError('auto updater', 'Error checking for update', err);

      this.resetState();
      // No-op: user can always access website
    });

    // Kick off an immediate check (packaged apps only); ignore errors here.
    try {
      autoUpdater.checkForUpdatesAndNotify();
    } catch (e) {
      logError('auto updater', 'Initial check failed', e as Error);
    }

    // Schedule periodic checks
    setInterval(() => {
      try {
        autoUpdater.checkForUpdatesAndNotify();
      } catch (e) {
        logError('auto updater', 'Scheduled check failed', e as Error);
      }
    }, APPLICATION.UPDATE_CHECK_INTERVAL_MS);
  }

  private setTooltipWithStatus(status: string) {
    this.menubar.tray.setToolTip(`${APPLICATION.NAME}\n${status}`);
  }

  private resetState() {
    this.menubar.tray.setToolTip(APPLICATION.NAME);
    this.menuBuilder.setCheckForUpdatesMenuEnabled(true);
    this.menuBuilder.setNoUpdateAvailableMenuVisibility(false);
    this.menuBuilder.setUpdateAvailableMenuVisibility(false);
    this.menuBuilder.setUpdateReadyForInstallMenuVisibility(false);
    // No-op
  }
}
