import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { vi } from 'vitest';

import { renderWithAppContext } from '../__helpers__/test-utils';

import useAccountsStore from '../stores/useAccountsStore';

import * as comms from '../utils/comms';
import { LoginRoute } from './Login';

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('renderer/routes/Login.tsx', () => {
  beforeEach(() => {
    useAccountsStore.setState({ accounts: [] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = renderWithAppContext(<LoginRoute />);

    expect(tree.container).toMatchSnapshot();
  });

  describe('login web pages', () => {
    it('should open create new token page', async () => {
      const openExternalLinkSpy = vi
        .spyOn(comms, 'openExternalLink')
        .mockImplementation(vi.fn());

      await act(async () => {
        renderWithAppContext(<LoginRoute />);
      });

      await userEvent.click(screen.getByTestId('login-create-token'));

      expect(openExternalLinkSpy).toHaveBeenCalledTimes(1);
    });

    it('should open login docs', async () => {
      const openExternalLinkSpy = vi
        .spyOn(comms, 'openExternalLink')
        .mockImplementation(vi.fn());

      await act(async () => {
        renderWithAppContext(<LoginRoute />);
      });

      await userEvent.click(screen.getByTestId('login-docs'));

      expect(openExternalLinkSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should navigate back to landing page on cancel', async () => {
    await act(async () => {
      renderWithAppContext(<LoginRoute />);
    });

    await userEvent.click(screen.getByTestId('login-cancel'));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
