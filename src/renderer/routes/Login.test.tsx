import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
    const tree = render(<LoginRoute />);

    expect(tree).toMatchSnapshot();
  });

  describe('login web pages', () => {
    it('should open create new token page', async () => {
      const mockOpenExternalLink = jest
        .spyOn(comms, 'openExternalLink')
        .mockImplementation();

      await act(async () => {
        render(<LoginRoute />);
      });

      await userEvent.click(screen.getByTestId('login-create-token'));

      expect(mockOpenExternalLink).toHaveBeenCalledTimes(1);
    });

    it('should open login docs', async () => {
      const mockOpenExternalLink = jest
        .spyOn(comms, 'openExternalLink')
        .mockImplementation();

      await act(async () => {
        render(<LoginRoute />);
      });

      await userEvent.click(screen.getByTestId('login-docs'));

      expect(mockOpenExternalLink).toHaveBeenCalledTimes(1);
    });
  });

  it('should navigate back to landing page on cancel', async () => {
    await act(async () => {
      render(<LoginRoute />);
    });

    await userEvent.click(screen.getByTestId('login-cancel'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
  });
});
