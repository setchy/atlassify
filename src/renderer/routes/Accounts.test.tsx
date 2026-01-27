import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import * as useLoggedNavigate from '../hooks/useLoggedNavigate';

import * as authUtils from '../utils/auth/utils';
import * as links from '../utils/links';
import * as theme from '../utils/theme';
import { AccountsRoute } from './Accounts';

const navigateMock = jest.fn();
jest
  .spyOn(useLoggedNavigate, 'useLoggedNavigate')
  .mockReturnValue(navigateMock);

describe('renderer/routes/Accounts.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('General', () => {
    it('should render itself & its children - light mode', async () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(true);

      await act(async () => {
        renderWithAppContext(<AccountsRoute />, {
          auth: {
            accounts: [mockAtlassianCloudAccount],
          },
        });
      });

      expect(screen.getByTestId('accounts')).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', async () => {
      jest.spyOn(theme, 'isLightMode').mockReturnValue(false);

      await act(async () => {
        renderWithAppContext(<AccountsRoute />, {
          auth: {
            accounts: [mockAtlassianCloudAccount],
          },
        });
      });

      expect(screen.getByTestId('accounts')).toMatchSnapshot();
    });

    it('should go back by pressing the icon', async () => {
      await act(async () => {
        renderWithAppContext(<AccountsRoute />);
      });

      await userEvent.click(screen.getByTestId('header-nav-back'));

      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(-1);
    });
  });

  describe('Account interactions', () => {
    it('open account profile in external browser', async () => {
      const openAccountProfileSpy = jest
        .spyOn(links, 'openAccountProfile')
        .mockImplementation();

      await act(async () => {
        renderWithAppContext(<AccountsRoute />, {
          auth: {
            accounts: [mockAtlassianCloudAccount],
          },
        });
      });

      await userEvent.click(screen.getByTestId('account-profile--itemInner'));

      expect(openAccountProfileSpy).toHaveBeenCalledTimes(1);
      expect(openAccountProfileSpy).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
      );
    });

    it('should refresh account', async () => {
      const refreshAccountSpy = jest
        .spyOn(authUtils, 'refreshAccount')
        .mockImplementation();

      await act(async () => {
        renderWithAppContext(<AccountsRoute />, {
          auth: {
            accounts: [mockAtlassianCloudAccount],
          },
        });
      });

      await userEvent.click(screen.getByTestId('account-refresh'));

      expect(refreshAccountSpy).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/accounts', {
        replace: true,
      });
    });

    it('should logout', async () => {
      const logoutFromAccountMock = jest.fn();

      await act(async () => {
        renderWithAppContext(<AccountsRoute />, {
          auth: {
            accounts: [mockAtlassianCloudAccount],
          },
          logoutFromAccount: logoutFromAccountMock,
        });
      });

      await userEvent.click(screen.getByTestId('account-logout'));

      expect(logoutFromAccountMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(-1);
    });
  });

  it('should add new accounts', async () => {
    await act(async () => {
      renderWithAppContext(<AccountsRoute />, {
        auth: { accounts: [mockAtlassianCloudAccount] },
      });
    });

    await userEvent.click(screen.getByTestId('account-add-new'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/login', {
      replace: true,
    });
  });
});
