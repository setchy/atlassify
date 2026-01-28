import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { vi } from 'vitest';

import { renderWithAppContext } from '../../__helpers__/test-utils';

import * as comms from '../../utils/comms';
import { SettingsFooter } from './SettingsFooter';

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => {
  const actual = require('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('renderer/components/settings/SettingsFooter.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show app version', async () => {
    await act(async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <SettingsFooter />
        </MemoryRouter>,
      );
    });

    expect(screen.getByTestId('settings-release-notes')).toMatchSnapshot();
  });

  it('should open release notes', async () => {
    const openExternalLinkSpy = vi
      .spyOn(comms, 'openExternalLink')
      .mockImplementation();

    await act(async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <SettingsFooter />
        </MemoryRouter>,
      );
    });

    await userEvent.click(screen.getByTestId('settings-release-notes'));

    expect(openExternalLinkSpy).toHaveBeenCalledTimes(1);
    expect(openExternalLinkSpy).toHaveBeenCalledWith(
      'https://github.com/setchy/atlassify/releases/tag/v0.0.1',
    );
  });

  it('should open account management', async () => {
    await act(async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <SettingsFooter />
        </MemoryRouter>,
      );
    });

    await userEvent.click(screen.getByTestId('settings-accounts'));

    expect(navigateMock).toHaveBeenCalledWith('/accounts');
  });

  it('should quit the app', async () => {
    const quitAppSpy = vi.spyOn(comms, 'quitApp');

    await act(async () => {
      renderWithAppContext(
        <MemoryRouter initialEntries={['/settings']}>
          <SettingsFooter />
        </MemoryRouter>,
      );
    });

    await userEvent.click(screen.getByTestId('settings-quit'));

    expect(quitAppSpy).toHaveBeenCalledTimes(1);
  });
});
