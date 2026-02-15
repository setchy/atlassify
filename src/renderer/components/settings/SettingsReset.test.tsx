import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import useSettingsStore from '../../stores/useSettingsStore';

import { SettingsReset } from './SettingsReset';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('renderer/components/settings/SettingsReset.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should reset default settings when `confirmed`', async () => {
    const resetSpy = vi.spyOn(useSettingsStore.getState(), 'reset');

    await act(async () => {
      renderWithAppContext(<SettingsReset />);
    });

    await userEvent.click(screen.getByTestId('settings-reset-defaults'));
    await userEvent.click(screen.getByTestId('settings-reset-confirm'));

    expect(resetSpy).toHaveBeenCalled();
  });

  it('should skip reset default settings when `cancelled`', async () => {
    const resetSpy = vi.spyOn(useSettingsStore.getState(), 'reset');

    await act(async () => {
      renderWithAppContext(<SettingsReset />);
    });

    await userEvent.click(screen.getByTestId('settings-reset-defaults'));
    await userEvent.click(screen.getByTestId('settings-reset-cancel'));

    expect(resetSpy).not.toHaveBeenCalled();
  });
});
