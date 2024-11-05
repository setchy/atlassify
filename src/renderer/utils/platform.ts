import os from 'node:os';
import path from 'node:path';
import { Constants } from './constants';

export function isLinux(): boolean {
  return process.platform === 'linux';
}

export function isMacOS(): boolean {
  return process.platform === 'darwin';
}

export function isWindows(): boolean {
  return process.platform === 'win32';
}

export const logDirectoryPaths = {
  win32: path.join(process.env.APPDATA || '', Constants.APP_NAME),
  darwin: path.join(os.homedir(), 'Library', 'Logs', Constants.APP_NAME),
  linux: path.join(os.homedir(), '.config', Constants.APP_NAME, 'logs'),
};
