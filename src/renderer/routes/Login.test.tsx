import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { navigateMock, renderWithProviders } from '../__helpers__/test-utils';

import { useAccountsStore } from '../stores';

import * as comms from '../utils/system/comms';
import { LoginRoute } from './Login';

describe('renderer/routes/Login.tsx', () => {
  beforeEach(() => {
    useAccountsStore.setState({ accounts: [] });
  });

  it('should render itself & its children', () => {
    const tree = renderWithProviders(<LoginRoute />);

    expect(tree.container).toMatchSnapshot();
  });

  describe('login web pages', () => {
    it('should open create new token page', async () => {
      const openExternalLinkSpy = vi
        .spyOn(comms, 'openExternalLink')
        .mockImplementation(vi.fn());

      await act(async () => {
        renderWithProviders(<LoginRoute />);
      });

      await userEvent.click(screen.getByTestId('login-create-token'));

      expect(openExternalLinkSpy).toHaveBeenCalledTimes(1);
    });

    it('should open login docs', async () => {
      const openExternalLinkSpy = vi
        .spyOn(comms, 'openExternalLink')
        .mockImplementation(vi.fn());

      await act(async () => {
        renderWithProviders(<LoginRoute />);
      });

      await userEvent.click(screen.getByTestId('login-docs'));

      expect(openExternalLinkSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should navigate back to landing page on cancel', async () => {
    await act(async () => {
      renderWithProviders(<LoginRoute />);
    });

    await userEvent.click(screen.getByTestId('login-cancel'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
