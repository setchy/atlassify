import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { TraySettings } from './TraySettings';

describe('renderer/components/settings/TraySettings.tsx', () => {
  const mockUpdateSetting = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle the showNotificationsCountInTray checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<TraySettings />, {
        updateSetting: mockUpdateSetting,
      });
    });

    await userEvent.click(
      screen.getByLabelText('Show notifications count in tray'),
    );

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith(
      'showNotificationsCountInTray',
      false,
    );
  });

  it('should toggle the useAlternateIdleIcon checkbox', async () => {
    await act(async () => {
      renderWithAppContext(<TraySettings />, {
        updateSetting: mockUpdateSetting,
      });
    });

    await userEvent.click(screen.getByLabelText('Use alternate idle icon'));

    expect(mockUpdateSetting).toHaveBeenCalledTimes(1);
    expect(mockUpdateSetting).toHaveBeenCalledWith(
      'useAlternateIdleIcon',
      true,
    );
  });
});
