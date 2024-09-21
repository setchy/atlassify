import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as comms from '../utils/comms';
import { LoginRoute } from './Login';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('routes/Login.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = render(
      <MemoryRouter>
        <LoginRoute />
      </MemoryRouter>,
    );

    expect(tree).toMatchSnapshot();
  });

  describe('login web pages', () => {
    it('should open create new token page', async () => {
      const openExternalLinkMock = jest
        .spyOn(comms, 'openExternalLink')
        .mockImplementation();

      await act(async () => {
        render(
          <MemoryRouter>
            <LoginRoute />
          </MemoryRouter>,
        );
      });

      fireEvent.click(screen.getByTestId('login-create-token'));

      expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
    });
    it('should open login docs', async () => {
      const openExternalLinkMock = jest
        .spyOn(comms, 'openExternalLink')
        .mockImplementation();

      await act(async () => {
        render(
          <MemoryRouter>
            <LoginRoute />
          </MemoryRouter>,
        );
      });

      fireEvent.click(screen.getByTestId('login-docs'));

      expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should navigate back to landing page on cancel', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LoginRoute />
        </MemoryRouter>,
      );
    });

    fireEvent.click(screen.getByTestId('login-cancel'));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, -1);
  });
});
