import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  mockAtlassianCloudAccount,
  mockAuth,
  mockSettings,
} from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import * as apiRequests from '../utils/api/request';
import * as comms from '../utils/comms';
import * as links from '../utils/links';
import * as theme from '../utils/theme';
import { AccountsRoute } from './Accounts';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('renderer/routes/Accounts.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('General', () => {
    it('should render itself & its children - light mode', async () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(true);

      await act(async () => {
        render(
          <AppContext.Provider
            value={{
              auth: {
                accounts: [mockAtlassianCloudAccount],
              },
              settings: mockSettings,
            }}
          >
            <AccountsRoute />
          </AppContext.Provider>,
        );
      });

      expect(screen.getByTestId('accounts')).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', async () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(false);

      await act(async () => {
        render(
          <AppContext.Provider
            value={{
              auth: {
                accounts: [mockAtlassianCloudAccount],
              },
              settings: mockSettings,
            }}
          >
            <AccountsRoute />
          </AppContext.Provider>,
        );
      });

      expect(screen.getByTestId('accounts')).toMatchSnapshot();
    });

    it('should go back by pressing the icon', async () => {
      await act(async () => {
        render(
          <AppContext.Provider
            value={{
              auth: mockAuth,
              settings: mockSettings,
            }}
          >
            <AccountsRoute />
          </AppContext.Provider>,
        );
      });

      await userEvent.click(screen.getByTestId('header-nav-back'));

      expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    });
  });

  describe('Account interactions', () => {
    it('open account profile in external browser', async () => {
      const openAccountProfileMock = jest
        .spyOn(links, 'openAccountProfile')
        .mockImplementation();

      await act(async () => {
        render(
          <AppContext.Provider
            value={{
              auth: {
                accounts: [mockAtlassianCloudAccount],
              },
              settings: mockSettings,
            }}
          >
            <AccountsRoute />
          </AppContext.Provider>,
        );
      });

      await userEvent.click(screen.getByTestId('account-profile--itemInner'));

      expect(openAccountProfileMock).toHaveBeenCalledTimes(1);
      expect(openAccountProfileMock).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
      );
    });

    it('should refresh account', async () => {
      const apiRequestMock = jest.spyOn(
        apiRequests,
        'performRequestForAccount',
      );

      await act(async () => {
        render(
          <AppContext.Provider
            value={{
              auth: {
                accounts: [mockAtlassianCloudAccount],
              },
              settings: mockSettings,
            }}
          >
            <AccountsRoute />
          </AppContext.Provider>,
        );
      });

      await userEvent.click(screen.getByTestId('account-refresh'));

      expect(apiRequestMock).toHaveBeenCalledTimes(1);

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenNthCalledWith(1, '/accounts', {
          replace: true,
        }),
      );
    });

    it('should logout', async () => {
      const logoutFromAccountMock = jest.fn();
      const updateTrayColorMock = jest.spyOn(comms, 'updateTrayColor');
      const updateTrayTitleMock = jest.spyOn(comms, 'updateTrayTitle');

      await act(async () => {
        render(
          <AppContext.Provider
            value={{
              auth: {
                accounts: [mockAtlassianCloudAccount],
              },
              settings: mockSettings,
              logoutFromAccount: logoutFromAccountMock,
            }}
          >
            <AccountsRoute />
          </AppContext.Provider>,
        );
      });

      await userEvent.click(screen.getByTestId('account-logout'));

      expect(logoutFromAccountMock).toHaveBeenCalledTimes(1);

      expect(updateTrayColorMock).toHaveBeenCalledTimes(1);
      expect(updateTrayColorMock).toHaveBeenCalledWith();
      expect(updateTrayTitleMock).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleMock).toHaveBeenCalledWith();

      expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    });
  });

  it('should add new accounts', async () => {
    await act(async () => {
      render(
        <AppContext.Provider
          value={{
            auth: { accounts: [mockAtlassianCloudAccount] },
            settings: mockSettings,
          }}
        >
          <AccountsRoute />
        </AppContext.Provider>,
      );
    });

    await userEvent.click(screen.getByTestId('account-add-new'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/login', {
      replace: true,
    });
  });
});
