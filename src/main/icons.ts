import path from 'node:path';

// Tray Icons
export const idleIcon = getIconPath('tray-idleTemplate.png');
export const idleAlternateIcon = getIconPath('tray-idle-white.png');
export const activeIcon = getIconPath('tray-active.png');

function getIconPath(iconName: string) {
  return path.resolve(__dirname, '../assets/images', iconName);
}
