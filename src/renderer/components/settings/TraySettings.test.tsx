import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import { TraySettings } from './TraySettings';

describe('renderer/components/settings/TraySettings.tsx', () => {
  const updateSettingMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle the showNotificationsCountInTray checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<TraySettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(
      screen.getByLabelText('Show notifications count in tray'),
    );

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith(
      'showNotificationsCountInTray',
      false,
    );
  });

  it('should toggle the useAlternateIdleIcon checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<TraySettings />, {
        updateSetting: updateSettingMock,
      });
    });

    await userEvent.click(screen.getByLabelText('Use alternate idle icon'));

    expect(updateSettingMock).toHaveBeenCalledTimes(1);
    expect(updateSettingMock).toHaveBeenCalledWith(
      'useAlternateIdleIcon',
      true,
    );
  });
});
