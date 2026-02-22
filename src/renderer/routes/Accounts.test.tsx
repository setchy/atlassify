import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import { useAccountsStore } from '../stores';

import * as links from '../utils/links';
import * as theme from '../utils/theme';
import { AccountsRoute } from './Accounts';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('renderer/routes/Accounts.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('General', () => {
    it('should render itself & its children - light mode', async () => {
      vi.spyOn(theme, 'isLightMode').mockReturnValue(true);
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<AccountsRoute />);

      expect(screen.getByTestId('accounts')).toMatchSnapshot();
    });

    it('should render itself & its children - dark mode', async () => {
      vi.spyOn(theme, 'isLightMode').mockReturnValue(false);
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<AccountsRoute />);

      expect(screen.getByTestId('accounts')).toMatchSnapshot();
    });

    it('should go back by pressing the icon', async () => {
      renderWithAppContext(<AccountsRoute />);

      await userEvent.click(screen.getByTestId('header-nav-back'));

      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(-1);
    });
  });

  describe('Account interactions', () => {
    it('open account profile in external browser', async () => {
      const openAccountProfileSpy = vi
        .spyOn(links, 'openAccountProfile')
        .mockImplementation(vi.fn());
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<AccountsRoute />);

      await userEvent.click(screen.getByTestId('account-profile--itemInner'));

      expect(openAccountProfileSpy).toHaveBeenCalledTimes(1);
      expect(openAccountProfileSpy).toHaveBeenCalledWith(
        mockAtlassianCloudAccount,
      );
    });

    it('should refresh account', async () => {
      const refreshAccountSpy = vi
        .spyOn(useAccountsStore.getState(), 'refreshAccount')
        .mockResolvedValue(mockAtlassianCloudAccount);
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<AccountsRoute />);

      await userEvent.click(screen.getByTestId('account-refresh'));

      // Wait for async operations to complete
      await act(async () => {
        await Promise.resolve();
      });

      expect(refreshAccountSpy).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith('/accounts', {
        replace: true,
      });
    });

    it('should logout', async () => {
      const removeAccountMock = vi
        .spyOn(useAccountsStore.getState(), 'removeAccount')
        .mockImplementation(vi.fn());
      useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

      renderWithAppContext(<AccountsRoute />);

      await userEvent.click(screen.getByTestId('account-logout'));

      expect(removeAccountMock).toHaveBeenCalledTimes(1);
      expect(removeAccountMock).toHaveBeenCalledWith(mockAtlassianCloudAccount);
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith(-1);
    });
  });

  it('should add new accounts', async () => {
    renderWithAppContext(<AccountsRoute />);

    await userEvent.click(screen.getByTestId('account-add-new'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/login', {
      replace: true,
    });
  });
});
