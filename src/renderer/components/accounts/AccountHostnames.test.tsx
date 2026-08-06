import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';

import { useAccountsStore } from '../../stores';

import type { CloudID, Hostname } from '../../types';

import { AccountHostnames } from './AccountHostnames';

describe('renderer/components/accounts/AccountHostnames.tsx', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render existing hints, flagging any that failed to resolve', () => {
    renderWithProviders(
      <AccountHostnames
        account={{
          ...mockAtlassianCloudAccount,
          hostnameHints: [
            {
              hostname: 'good.atlassian.net' as Hostname,
              cloudId: 'cloud-1' as CloudID,
            },
            { hostname: 'bad.atlassian.net' as Hostname, cloudId: null },
          ],
        }}
      />,
    );

    expect(screen.getByText('good.atlassian.net')).toBeInTheDocument();
    expect(screen.getByText('bad.atlassian.net')).toBeInTheDocument();
    expect(
      screen.getByTestId('close-button-hostname-hint-bad.atlassian.net'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Could not resolve this host name to a site'),
    ).toBeInTheDocument();
  });

  it('should add a hostname hint on submit and clear the input', async () => {
    const addHostnameHintSpy = vi
      .spyOn(useAccountsStore.getState(), 'addHostnameHint')
      .mockResolvedValue(true);

    renderWithProviders(
      <AccountHostnames account={mockAtlassianCloudAccount} />,
    );

    const input = screen.getByRole('textbox', { name: 'Add host name' });

    await userEvent.type(input, 'new.atlassian.net');
    await userEvent.click(screen.getByTestId('hostname-hint-add'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(addHostnameHintSpy).toHaveBeenCalledWith(
      mockAtlassianCloudAccount,
      'new.atlassian.net',
    );
    expect(input).toHaveValue('');
  });

  it('should show a resolution error when the hostname fails to resolve', async () => {
    vi.spyOn(useAccountsStore.getState(), 'addHostnameHint').mockResolvedValue(
      false,
    );

    renderWithProviders(
      <AccountHostnames account={mockAtlassianCloudAccount} />,
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Add host name' }),
      'unknown.atlassian.net',
    );
    await userEvent.click(screen.getByTestId('hostname-hint-add'));

    expect(
      await screen.findByText(
        'Could not resolve this host name to a site. Check the host name and try again.',
      ),
    ).toBeInTheDocument();
  });

  it('should remove a hostname hint', async () => {
    const removeHostnameHintSpy = vi
      .spyOn(useAccountsStore.getState(), 'removeHostnameHint')
      .mockImplementation(vi.fn());

    renderWithProviders(
      <AccountHostnames
        account={{
          ...mockAtlassianCloudAccount,
          hostnameHints: [
            {
              hostname: 'good.atlassian.net' as Hostname,
              cloudId: 'cloud-1' as CloudID,
            },
          ],
        }}
      />,
    );

    await userEvent.click(
      screen.getByTestId('close-button-hostname-hint-good.atlassian.net'),
    );

    expect(removeHostnameHintSpy).toHaveBeenCalledWith(
      expect.objectContaining({ id: mockAtlassianCloudAccount.id }),
      'good.atlassian.net',
    );
  });
});
