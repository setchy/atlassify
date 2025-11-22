import path from 'node:path';

export const TrayIcons = {
  active: getIconPath('tray-active.png'),
  idle: getIconPath('tray-idleTemplate.png'),
  idleAlternate: getIconPath('tray-idle-white.png'),
  offline: getIconPath('tray-offline.png'),
  error: getIconPath('tray-error.png'),
};

function getIconPath(iconName: string) {
  return path.join(__dirname, '..', 'assets', 'images', iconName);
}
