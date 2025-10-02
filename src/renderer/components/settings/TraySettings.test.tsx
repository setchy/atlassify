import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAuth, mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import { TraySettings } from './TraySettings';

describe('renderer/components/settings/TraySettings.tsx', () => {
  const updateSetting = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle the showNotificationsCountInTray checkbox', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <TraySettings />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(
      screen.getByLabelText('Show notifications count in tray'),
    );

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith(
      'showNotificationsCountInTray',
      false,
    );
  });

  it('should toggle the useAlternateIdleIcon checkbox', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <TraySettings />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByLabelText('Use alternate idle icon'));

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('useAlternateIdleIcon', true);
  });
});
