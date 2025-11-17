import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../__helpers__/test-utils';
import * as comms from '../utils/comms';
import { LoginRoute } from './Login';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
