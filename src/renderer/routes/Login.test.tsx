import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { mockNavigate } from '../__mocks__/navigation';

import * as comms from '../utils/comms';
import { LoginRoute } from './Login';

describe('renderer/routes/Login.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
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
      const openExternalLinkMock = vi
        .spyOn(comms, 'openExternalLink')
        .mockImplementation(vi.fn());

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
      const openExternalLinkMock = vi
        .spyOn(comms, 'openExternalLink')
        .mockImplementation(vi.fn());

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
