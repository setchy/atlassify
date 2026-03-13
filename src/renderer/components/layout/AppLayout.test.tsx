import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockAtlassianCloudAccount } from '../../__mocks__/account-mocks';

import { useAccountsStore } from '../../stores';

import { AppLayout } from './AppLayout';

describe('renderer/components/layout/AppLayout.tsx', () => {
  it('should render itself & its children', () => {
    useAccountsStore.setState({ accounts: [mockAtlassianCloudAccount] });

    const tree = renderWithAppContext(<AppLayout>Test</AppLayout>, {
      notifications: [],
    });

    expect(tree.container).toMatchSnapshot();
  });
});
