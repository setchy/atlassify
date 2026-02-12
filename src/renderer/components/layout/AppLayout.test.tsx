import { MemoryRouter } from 'react-router-dom';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';

import useAccountsStore from '../../stores/useAccountsStore';

import { AppLayout } from './AppLayout';

describe('renderer/components/layout/AppLayout.tsx', () => {
  it('should render itself & its children', () => {
    useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });
    const tree = renderWithAppContext(
      <MemoryRouter>
        <AppLayout>Test</AppLayout>
      </MemoryRouter>,
      {
        notifications: [],
      },
    );

    expect(tree.container).toMatchSnapshot();
  });
});
