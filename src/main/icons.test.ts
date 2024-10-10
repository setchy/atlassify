import { activeIcon, idleAlternateIcon, idleIcon } from './icons';

describe('main/icons.ts', () => {
  it('should return icon images', () => {
    expect(idleIcon).toContain('assets/images/tray-idleTemplate.png');
    expect(idleAlternateIcon).toContain('assets/images/tray-idle-white.png');
    expect(activeIcon).toContain('assets/images/tray-active.png');
  });
});
