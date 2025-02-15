import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockNavigate } from '../__mocks__/navigation';
import {
  mockAtlassianCloudAccount,
  mockAuth,
  mockSettings,
} from '../__mocks__/state';

import { AppContext } from '../context/App';
import * as apiRequests from '../utils/api/request';
import * as comms from '../utils/comms';
import * as links from '../utils/links';
import * as theme from '../utils/theme';

import { AccountsRoute } from './Accounts';

describe('renderer/routes/Accounts.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('General', () => {
    it('should render itself & its children - light mode', async () => {
      vi.spyOn(theme, 'isLightMode').mockReturnValue(true);

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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      expect(screen.getByTestId('accounts')).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', async () => {
      vi.spyOn(theme, 'isLightMode').mockReturnValue(false);

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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTestId('header-nav-back'));

      expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    });
  });

  describe('Account interactions', () => {
    it('open account profile in external browser', async () => {
      const openAccountProfileMock = vi
        .spyOn(links, 'openAccountProfile')
        .mockImplementation(vi.fn());

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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTestId('account-profile--itemInner'));

      expect(openAccountProfileMock).toHaveBeenCalledTimes(1);
      expect(openAccountProfileMock).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
      );
    });

    it('should refresh account', async () => {
      const apiRequestMock = vi.spyOn(apiRequests, 'performPostRequest');

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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTestId('account-refresh'));

      expect(apiRequestMock).toHaveBeenCalledTimes(1);

      await waitFor(() =>
        expect(mockNavigate).toHaveBeenNthCalledWith(1, '/accounts', {
          replace: true,
        }),
      );
    });

    it('should logout', async () => {
      const logoutFromAccountMock = vi.fn();
      const updateTrayIconMock = vi.spyOn(comms, 'updateTrayIcon');
      const updateTrayTitleMock = vi.spyOn(comms, 'updateTrayTitle');

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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTestId('account-logout'));

      expect(logoutFromAccountMock).toHaveBeenCalledTimes(1);

      expect(updateTrayIconMock).toHaveBeenCalledTimes(1);
      expect(updateTrayIconMock).toHaveBeenCalledWith();
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
          <MemoryRouter>
            <AccountsRoute />
          </MemoryRouter>
        </AppContext.Provider>,
      );
    });

    fireEvent.click(screen.getByTestId('account-add-new'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/login', {
      replace: true,
    });
  });
});
