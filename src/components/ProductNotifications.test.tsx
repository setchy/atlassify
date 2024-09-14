import { act, fireEvent, render, screen } from '@testing-library/react';
import { mockAtlassianCloudAccount } from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import { mockAtlasifyNotification } from '../utils/api/__mocks__/response-mocks';
import { ProductNotifications } from './ProductNotifications';
import { Product } from '../utils/api/types';

jest.mock('./NotificationRow', () => ({
  NotificationRow: () => <div>NotificationRow</div>,
}));

describe('components/ProductNotifications.tsx', () => {
  const props = {
    account: mockAtlassianCloudAccount,
    product: 'bitbucket' as Product,
    productNotifications: mockAtlasifyNotification,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const tree = render(
      <AppContext.Provider value={{}}>
        <ProductNotifications {...props} />
      </AppContext.Provider>,
    );
    expect(tree).toMatchSnapshot();
  });

  it('should toggle account notifications visibility', async () => {
    await act(async () => {
      render(<ProductNotifications {...props} />);
    });

    fireEvent.click(screen.getByTitle('Hide product notifications'));

    const tree = render(<ProductNotifications {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
