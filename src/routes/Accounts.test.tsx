import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  mockAtlassianCloudAccount,
  mockAuth,
  mockSettings,
} from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import * as apiRequests from '../utils/api/request';
import * as comms from '../utils/comms';
import * as links from '../utils/links';

import { AccountsRoute } from './Accounts';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('routes/Accounts.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('General', () => {
    it('should render itself & its children', async () => {
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

      fireEvent.click(screen.getByLabelText('Go Back'));
      expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    });
  });

  describe('Account interactions', () => {
    it('open profile in external browser', async () => {
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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTitle('Open Profile'));

      expect(openAccountProfileMock).toHaveBeenCalledTimes(1);
      expect(openAccountProfileMock).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
      );
    });

    it('open host in external browser', async () => {
      const openExternalLinkMock = jest
        .spyOn(comms, 'openExternalLink')
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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTitle('Open Host'));

      expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
      expect(openExternalLinkMock).toHaveBeenCalledWith('https://github.com');
    });

    it('open developer settings in external browser', async () => {
      const openExternalLinkMock = jest
        .spyOn(comms, 'openExternalLink')
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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTitle('Open Developer Settings'));

      expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
      expect(openExternalLinkMock).toHaveBeenCalledWith(
        'https://github.com/settings/tokens',
      );
    });

    it('should refresh account', async () => {
      const apiRequestAuthMock = jest.spyOn(apiRequests, 'apiRequestAuth');

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

      fireEvent.click(screen.getByTitle('Refresh octocat'));

      expect(apiRequestAuthMock).toHaveBeenCalledTimes(1);
      expect(apiRequestAuthMock).toHaveBeenCalledWith(
        'https://api.github.com/user',
        'GET',
        'token-123-456',
      );
      await waitFor(() =>
        expect(mockNavigate).toHaveBeenNthCalledWith(1, '/accounts', {
          replace: true,
        }),
      );
    });

    it('should logout', async () => {
      const logoutFromAccountMock = jest.fn();
      const updateTrayIconMock = jest.spyOn(comms, 'updateTrayIcon');
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
            <MemoryRouter>
              <AccountsRoute />
            </MemoryRouter>
          </AppContext.Provider>,
        );
      });

      fireEvent.click(screen.getByTitle('Logout octocat'));

      expect(logoutFromAccountMock).toHaveBeenCalledTimes(1);

      expect(updateTrayIconMock).toHaveBeenCalledTimes(1);
      expect(updateTrayIconMock).toHaveBeenCalledWith();
      expect(updateTrayTitleMock).toHaveBeenCalledTimes(1);
      expect(updateTrayTitleMock).toHaveBeenCalledWith();
      expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
    });
  });

  describe('Add new accounts', () => {
    it('should login with atlassian account', async () => {
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

      expect(screen.getByTitle('Login with Atlassian App').hidden).toBe(false);

      fireEvent.click(screen.getByTitle('Login with Atlassian'));
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/login-api-token', {
        replace: true,
      });
    });
  });
});
