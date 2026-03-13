import path from 'node:path';

/**
 * Absolute paths to each tray icon image asset.
 */
export const TrayIcons = {
  active: getIconPath('tray-active.png'),
  idle: getIconPath('tray-idleTemplate.png'),
  idleAlternate: getIconPath('tray-idle-white.png'),
  error: getIconPath('tray-error.png'),
  offline: getIconPath('tray-offline.png'),
};

/**
 * Resolves the absolute path to a tray icon asset file.
 *
 * @param iconName - The filename of the icon (e.g. `'tray-active.png'`).
 * @returns Absolute path to the icon within the app's `assets/images` directory.
 */
function getIconPath(iconName: string) {
  return path.resolve(__dirname, 'assets', 'images', iconName);
}
