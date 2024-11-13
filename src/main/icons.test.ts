import { TrayIcons } from './icons';

describe('main/icons.ts', () => {
  it('should return icon images', () => {
    expect(TrayIcons.active).toContain('assets/images/tray-active.png');

    expect(TrayIcons.idle).toContain('assets/images/tray-idleTemplate.png');

    expect(TrayIcons.idleAlternate).toContain(
      'assets/images/tray-idle-white.png',
    );
  });
});
