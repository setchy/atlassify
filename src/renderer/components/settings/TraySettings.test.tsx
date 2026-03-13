import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import { useSettingsStore } from '../../stores';

import { TraySettings } from './TraySettings';

describe('renderer/components/settings/TraySettings.tsx', () => {
  let toggleSettingSpy: ReturnType<typeof vi.spyOn>;
  let updateSettingSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    toggleSettingSpy = vi.spyOn(useSettingsStore.getState(), 'toggleSetting');
    updateSettingSpy = vi.spyOn(useSettingsStore.getState(), 'updateSetting');

    renderWithAppContext(<TraySettings />);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should toggle the showNotificationsCountInTray checkbox', async () => {
    await userEvent.click(
      screen.getByLabelText('Show notifications count in tray'),
    );

    expect(toggleSettingSpy).toHaveBeenCalledTimes(1);
    expect(toggleSettingSpy).toHaveBeenCalledWith(
      'showNotificationsCountInTray',
    );
  });

  it('should set useUnreadActiveIcon to false when Stealth radio is selected', async () => {
    await userEvent.click(screen.getByRole('radio', { name: 'Stealth' }));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('useUnreadActiveIcon', false);
  });

  it('should set useUnreadActiveIcon to true when Highlighted radio is selected', async () => {
    // Default store has useUnreadActiveIcon=true (Highlighted already checked),
    // so set to false first so Highlighted becomes clickable
    act(() => {
      useSettingsStore.setState({ useUnreadActiveIcon: false });
    });

    await userEvent.click(screen.getByRole('radio', { name: 'Highlighted' }));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('useUnreadActiveIcon', true);
  });

  it('should set useAlternateIdleIcon to false when Default radio is selected', async () => {
    // Default store has useAlternateIdleIcon=false (Default already checked),
    // so set to true first so Default becomes clickable
    act(() => {
      useSettingsStore.setState({ useAlternateIdleIcon: true });
    });

    await userEvent.click(screen.getByRole('radio', { name: 'Default' }));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith(
      'useAlternateIdleIcon',
      false,
    );
  });

  it('should set useAlternateIdleIcon to true when Alternate radio is selected', async () => {
    await userEvent.click(screen.getByRole('radio', { name: 'Alternate' }));

    expect(updateSettingSpy).toHaveBeenCalledTimes(1);
    expect(updateSettingSpy).toHaveBeenCalledWith('useAlternateIdleIcon', true);
  });
});
