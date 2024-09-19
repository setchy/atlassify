import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  mockAtlassianCloudAccount,
  mockSettings,
} from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import { mockAtlassifyNotifications } from '../utils/api/__mocks__/response-mocks';
import type { Product } from '../utils/api/types';
import * as comms from '../utils/comms';
import { ProductNotifications } from './ProductNotifications';

jest.mock('./NotificationRow', () => ({
  NotificationRow: () => <div>NotificationRow</div>,
}));

const openExternalLinkMock = jest
  .spyOn(comms, 'openExternalLink')
  .mockImplementation();

describe('components/ProductNotifications.tsx', () => {
  const props = {
    account: mockAtlassianCloudAccount,
    product: 'bitbucket' as Product,
    productNotifications: mockAtlassifyNotifications,
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

  it('should open product home when available', async () => {
    await act(async () => {
      render(<ProductNotifications {...props} />);
    });

    fireEvent.click(screen.getByTestId('product-home-button'));

    expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
  });

  it('should toggle product notifications visibility', async () => {
    await act(async () => {
      render(<ProductNotifications {...props} />);
    });

    fireEvent.click(screen.getByTitle('Hide product notifications'));

    const tree = render(<ProductNotifications {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should mark all product notifications as read', async () => {
    const markNotificationsReadMock = jest.fn();

    const props = {
      productNotifications: mockAtlassifyNotifications,
    };

    render(
      <AppContext.Provider
        value={{
          settings: mockSettings,
          markNotificationsRead: markNotificationsReadMock,
        }}
      >
        <ProductNotifications {...props} />
      </AppContext.Provider>,
    );

    fireEvent.click(
      screen.getByTitle('Mark all product notifications as read'),
    );
    expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
  });
});
