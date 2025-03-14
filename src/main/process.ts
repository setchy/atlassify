/* istanbul ignore file */
// This file is excluded from test coverage because it's platform-specific utility functions

export function isLinux(): boolean {
  return process.platform === 'linux';
}

export function isMacOS(): boolean {
  return process.platform === 'darwin';
}

export function isWindows(): boolean {
  return process.platform === 'win32';
}
