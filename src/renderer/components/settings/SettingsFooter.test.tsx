import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAuth, mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import * as comms from '../../utils/comms';
import { SettingsFooter } from './SettingsFooter';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('renderer/components/settings/SettingsFooter.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show app version', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <SettingsFooter />
        </AppContext.Provider>,
      );
    });

    expect(screen.getByTestId('settings-release-notes')).toMatchSnapshot();
  });

  it('should open release notes', async () => {
    const mockOpenExternalLink = jest
      .spyOn(comms, 'openExternalLink')
      .mockImplementation();

    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <SettingsFooter />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByTestId('settings-release-notes'));

    expect(mockOpenExternalLink).toHaveBeenCalledTimes(1);
    expect(mockOpenExternalLink).toHaveBeenCalledWith(
      'https://github.com/setchy/atlassify/releases/tag/v0.0.1',
    );
  });

  it('should open account management', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <SettingsFooter />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByTestId('settings-accounts'));

    expect(mockNavigate).toHaveBeenCalledWith('/accounts');
  });

  it('should quit the app', async () => {
    const mockQuitApp = jest.spyOn(comms, 'quitApp');

    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: mockAuth,
            settings: mockSettings,
          }}
        >
          <SettingsFooter />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByTestId('settings-quit'));

    expect(mockQuitApp).toHaveBeenCalledTimes(1);
  });
});
