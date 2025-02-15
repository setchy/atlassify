import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockAuth, mockSettings } from '../../__mocks__/state';
import { AppContext } from '../../context/App';
import { SystemSettings } from './SystemSettings';

describe('renderer/components/settings/SystemSettings.tsx', () => {
  const updateSetting = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should change the open links radio group', async () => {
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
            <SystemSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByLabelText('Background'));

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('openLinks', 'BACKGROUND');
  });

  it('should toggle the keyboardShortcutEnabled checkbox', async () => {
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
            <SystemSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByLabelText('Enable keyboard shortcut'), {
      target: { checked: true },
    });

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith(
      'keyboardShortcutEnabled',
      false,
    );
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
          <MemoryRouter>
            <SystemSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByLabelText('Show notifications count in tray'), {
      target: { checked: true },
    });

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith(
      'showNotificationsCountInTray',
      false,
    );
  });

  it('should toggle the showSystemNotifications checkbox', async () => {
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
            <SystemSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByLabelText('Show system notifications'), {
      target: { checked: true },
    });

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith(
      'showSystemNotifications',
      false,
    );
  });

  it('should toggle the playSoundNewNotifications checkbox', async () => {
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
            <SystemSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByLabelText('Play sound for new notifications'), {
      target: { checked: true },
    });

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith(
      'playSoundNewNotifications',
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
          <MemoryRouter>
            <SystemSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByLabelText('Use alternate idle icon'), {
      target: { checked: true },
    });

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('useAlternateIdleIcon', false);
  });

  it('should toggle the openAtStartup checkbox', async () => {
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
            <SystemSettings />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByLabelText('Open at startup'), {
      target: { checked: true },
    });

    expect(updateSetting).toHaveBeenCalledTimes(1);
    expect(updateSetting).toHaveBeenCalledWith('openAtStartup', false);
  });
});
