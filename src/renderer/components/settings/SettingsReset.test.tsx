import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { SettingsReset } from './SettingsReset';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('renderer/components/settings/SettingsReset.tsx', () => {
  const mockResetSettings = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reset default settings when `confirmed`', async () => {
    await act(async () => {
      renderWithAppContext(<SettingsReset />, {
        resetSettings: mockResetSettings,
      });
    });

    await userEvent.click(screen.getByTestId('settings-reset-defaults'));
    await userEvent.click(screen.getByTestId('settings-reset-confirm'));

    expect(mockResetSettings).toHaveBeenCalled();
  });

  it('should skip reset default settings when `cancelled`', async () => {
    await act(async () => {
      renderWithAppContext(<SettingsReset />, {
        resetSettings: mockResetSettings,
      });
    });

    await userEvent.click(screen.getByTestId('settings-reset-defaults'));
    await userEvent.click(screen.getByTestId('settings-reset-cancel'));

    expect(mockResetSettings).not.toHaveBeenCalled();
  });
});
