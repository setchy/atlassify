import fs from 'node:fs';
import os from 'node:os';
import { dialog, shell } from 'electron';
import log from 'electron-log';
import type { Menubar } from 'menubar';
import { logDirectoryPaths } from '../renderer/utils/platform';

export function takeScreenshot(mb: Menubar) {
  const date = new Date();
  const dateStr = date.toISOString().replace(/:/g, '-');

  const capturedPicFilePath = `${os.homedir()}/${dateStr}-atlassify-screenshot.png`;
  mb.window.capturePage().then((img) => {
    fs.writeFile(capturedPicFilePath, img.toPNG(), () =>
      log.info(`Screenshot saved ${capturedPicFilePath}`),
    );
  });
}

export function resetApp(mb: Menubar) {
  const cancelButtonId = 0;
  const resetButtonId = 1;

  const response = dialog.showMessageBoxSync(mb.window, {
    type: 'warning',
    title: 'Reset Atlassify',
    message:
      'Are you sure you want to reset Atlassify? You will be logged out of all accounts',
    buttons: ['Cancel', 'Reset'],
    defaultId: cancelButtonId,
    cancelId: cancelButtonId,
  });

  if (response === resetButtonId) {
    mb.window.webContents.send('atlassify:reset-app');
    mb.app.quit();
  }
}

export function openLogsDirectory() {
  const logDirectory = logDirectoryPaths[process.platform];

  if (!logDirectory) {
    log.error(
      `Unsupported platform: ${process.platform}! Cannot open logs directory`,
    );
    return;
  }

  shell.openPath(logDirectory);
}
