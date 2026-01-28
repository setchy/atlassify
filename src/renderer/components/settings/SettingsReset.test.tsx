import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import { SettingsReset } from './SettingsReset';

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = vi.importActual ? vi.importActual('react-router-dom') : {};
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('renderer/components/settings/SettingsReset.tsx', () => {
  const resetSettingsMock = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should reset default settings when `confirmed`', async () => {
    await act(async () => {
      renderWithAppContext(<SettingsReset />, {
        resetSettings: resetSettingsMock,
      });
    });

    await userEvent.click(screen.getByTestId('settings-reset-defaults'));
    await userEvent.click(screen.getByTestId('settings-reset-confirm'));

    expect(resetSettingsMock).toHaveBeenCalled();
  });

  it('should skip reset default settings when `cancelled`', async () => {
    await act(async () => {
      renderWithAppContext(<SettingsReset />, {
        resetSettings: resetSettingsMock,
      });
    });

    await userEvent.click(screen.getByTestId('settings-reset-defaults'));
    await userEvent.click(screen.getByTestId('settings-reset-cancel'));

    expect(resetSettingsMock).not.toHaveBeenCalled();
  });
});
