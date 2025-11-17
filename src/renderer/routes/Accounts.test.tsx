import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';
import { mockAuth, mockSettings } from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import * as apiRequests from '../utils/api/request';
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
      const mockOpenAccountProfile = jest
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

      expect(mockOpenAccountProfile).toHaveBeenCalledTimes(1);
      expect(mockOpenAccountProfile).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
      );
    });

    it('should refresh account', async () => {
      const mockPerformRequestForAccount = jest.spyOn(
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

      expect(mockPerformRequestForAccount).toHaveBeenCalledTimes(1);

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenNthCalledWith(1, '/accounts', {
          replace: true,
        }),
      );
    });

    it('should logout', async () => {
      const mockLogoutFromAccount = jest.fn();

      await act(async () => {
        render(
          <AppContext.Provider
            value={{
              auth: {
                accounts: [mockAtlassianCloudAccount],
              },
              settings: mockSettings,
              logoutFromAccount: mockLogoutFromAccount,
            }}
          >
            <AccountsRoute />
          </AppContext.Provider>,
        );
      });

      await userEvent.click(screen.getByTestId('account-logout'));

      expect(mockLogoutFromAccount).toHaveBeenCalledTimes(1);

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
