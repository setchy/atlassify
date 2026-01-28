import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import * as authUtils from '../utils/auth/utils';
import * as links from '../utils/links';
import * as theme from '../utils/theme';
import { AccountsRoute } from './Accounts';

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('renderer/routes/Accounts.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('General', () => {
    it('should render itself & its children - light mode', async () => {
      vi.spyOn(theme, 'isLightMode').mockReturnValue(true);

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
      vi.spyOn(theme, 'isLightMode').mockReturnValue(false);

      await act(async () => {
        renderWithAppContext(<AccountsRoute />, {
          accounts: [mockAtlassianCloudAccount],
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
      const openAccountProfileSpy = vi
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
      const refreshAccountSpy = vi
        .spyOn(authUtils, 'refreshAccount')
        .mockImplementation(async (account) => account);

      await act(async () => {
        renderWithAppContext(<AccountsRoute />, {
          auth: {
            accounts: [mockAtlassianCloudAccount],
          },
        });
      });

      await userEvent.click(screen.getByTestId('account-refresh'));

      // Wait for navigation to be called (since it's after async refreshAccount)
      await act(async () => {
        // Wait for the next tick to allow navigation to be called
        await Promise.resolve();
      });

      expect(refreshAccountSpy).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/accounts', {
        replace: true,
      });
    });

    it('should logout', async () => {
      const logoutFromAccountMock = vi.fn();

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
