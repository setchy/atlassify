import { dialog, type MessageBoxOptions } from 'electron';
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
    });

    autoUpdater.on('update-available', () => {
      logInfo('auto updater', 'New update available');

      this.setTooltipWithStatus('A new update is available');
      this.menuBuilder.setUpdateAvailableMenuVisibility(true);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      this.setTooltipWithStatus(
        `Downloading update: ${progressObj.percent.toFixed(2)}%`,
      );
    });

    autoUpdater.on('update-downloaded', (event) => {
      logInfo('auto updater', 'Update downloaded');

      this.setTooltipWithStatus('A new update is ready to install');
      this.menuBuilder.setUpdateAvailableMenuVisibility(false);
      this.menuBuilder.setUpdateReadyForInstallMenuVisibility(true);

      this.showUpdateReadyDialog(event.releaseName);
    });

    autoUpdater.on('update-not-available', () => {
      logInfo('auto updater', 'Update not available');

      this.menuBuilder.setCheckForUpdatesMenuEnabled(true);
      this.menuBuilder.setNoUpdateAvailableMenuVisibility(true);
      this.menuBuilder.setUpdateAvailableMenuVisibility(false);
      this.menuBuilder.setUpdateReadyForInstallMenuVisibility(false);
    });

    autoUpdater.on('update-cancelled', () => {
      logInfo('auto updater', 'Update cancelled');

      this.resetState();
    });

    autoUpdater.on('error', (err) => {
      logError('auto updater', 'Error checking for update', err);

      this.resetState();
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
  }

  private showUpdateReadyDialog(releaseName: string) {
    const dialogOpts: MessageBoxOptions = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: `${APPLICATION.NAME} ${releaseName} has been downloaded`,
      detail:
        'Restart to apply the update. You can also restart later from the tray menu.',
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
  }
}
