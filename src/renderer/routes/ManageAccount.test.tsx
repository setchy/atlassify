import { screen } from '@testing-library/react';

import { navigateMock, renderWithProviders } from '../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../__mocks__/account-mocks';

import { ManageAccountRoute } from './ManageAccount';

describe('renderer/routes/ManageAccount.tsx', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the account header and hostname section', () => {
    renderWithProviders(<ManageAccountRoute />, {
      initialEntries: [
        `/accounts/manage?accountId=${mockAtlassianCloudAccount.id}`,
      ],
    });

    expect(screen.getByTestId('manage-account')).toBeInTheDocument();
    expect(
      screen.getByText(mockAtlassianCloudAccount.username),
    ).toBeInTheDocument();
    expect(screen.getByText('Manage account')).toBeInTheDocument();
  });

  it('should navigate back to accounts when the account cannot be found', () => {
    renderWithProviders(<ManageAccountRoute />, {
      initialEntries: ['/accounts/manage?accountId=unknown'],
    });

    expect(navigateMock).toHaveBeenCalledWith('/accounts', { replace: true });
  });
});
