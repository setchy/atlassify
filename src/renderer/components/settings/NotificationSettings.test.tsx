import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { mockAuth, mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import { NotificationSettings } from './NotificationSettings';

describe('renderer/components/settings/NotificationSettings.tsx', () => {
  const updateSetting = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle the markAsReadOnOpen checkbox', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <MemoryRouter>
            <NotificationSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByLabelText('Mark as read on open'));

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('markAsReadOnOpen', false);
  });

  it('should toggle the sortGroupedNotificationsByProductAlphabetically checkbox', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <MemoryRouter>
            <NotificationSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    await userEvent.click(
      screen.getByLabelText('Group product notifications alphabetically'),
    );

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith(
      'groupNotificationsByProductAlphabetically',
      true,
    );
  });

  it('should toggle the delayNotificationState checkbox', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
            updateSetting,
          }}
        >
          <MemoryRouter>
            <NotificationSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByLabelText('Delay notification state'));

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('delayNotificationState', true);
  });
});
