import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../__helpers__/test-utils';

import { useSettingsStore } from '../../stores';

import { SettingsReset } from './SettingsReset';

describe('renderer/components/settings/SettingsReset.tsx', () => {
  let resetSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    resetSpy = vi.spyOn(useSettingsStore.getState(), 'reset');

    renderWithProviders(<SettingsReset />);
  });

  it('should reset default settings when `confirmed`', async () => {
    await userEvent.click(screen.getByTestId('settings-reset-defaults'));
    await userEvent.click(screen.getByTestId('settings-reset-confirm'));

    expect(resetSpy).toHaveBeenCalled();
  });

  it('should skip reset default settings when `cancelled`', async () => {
    await userEvent.click(screen.getByTestId('settings-reset-defaults'));
    await userEvent.click(screen.getByTestId('settings-reset-cancel'));

    expect(resetSpy).not.toHaveBeenCalled();
  });
});
