import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../__helpers__/test-utils';

import * as useLoggedNavigate from '../hooks/useLoggedNavigate';

import * as comms from '../utils/comms';
import { LoginRoute } from './Login';

const navigateMock = jest.fn();
jest
  .spyOn(useLoggedNavigate, 'useLoggedNavigate')
  .mockReturnValue(navigateMock);

describe('renderer/routes/Login.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = renderWithAppContext(<LoginRoute />);

    expect(tree).toMatchSnapshot();
  });

  describe('login web pages', () => {
    it('should open create new token page', async () => {
      const openExternalLinkSpy = jest
        .spyOn(comms, 'openExternalLink')
        .mockImplementation();

      await act(async () => {
        renderWithAppContext(<LoginRoute />);
      });

      await userEvent.click(screen.getByTestId('login-create-token'));

      expect(openExternalLinkSpy).toHaveBeenCalledTimes(1);
    });

    it('should open login docs', async () => {
      const openExternalLinkSpy = jest
        .spyOn(comms, 'openExternalLink')
        .mockImplementation();

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
