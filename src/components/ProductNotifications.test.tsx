import { act, fireEvent, render, screen } from '@testing-library/react';
import { mockAtlassifyNotifications } from '../__mocks__/notifications-mocks';
import {
  mockAtlassianCloudAccount,
  mockSettings,
} from '../__mocks__/state-mocks';
import { AppContext } from '../context/App';
import type { ProductName } from '../types';
import * as comms from '../utils/comms';
import { ProductNotifications } from './ProductNotifications';

jest.mock('./NotificationRow', () => ({
  NotificationRow: () => <div>NotificationRow</div>,
}));

const openExternalLinkMock = jest
  .spyOn(comms, 'openExternalLink')
  .mockImplementation();

describe('components/ProductNotifications.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children', () => {
    const props = {
      account: mockAtlassianCloudAccount,
      product: 'bitbucket' as ProductName,
      productNotifications: mockAtlassifyNotifications,
    };

    const tree = render(
      <AppContext.Provider value={{}}>
        <ProductNotifications {...props} />
      </AppContext.Provider>,
    );

    expect(tree).toMatchSnapshot();
  });

  it('should open product home when available', async () => {
    const props = {
      account: mockAtlassianCloudAccount,
      product: 'bitbucket' as ProductName,
      productNotifications: mockAtlassifyNotifications,
    };

    await act(async () => {
      render(<ProductNotifications {...props} />);
    });

    fireEvent.click(screen.getByTestId('product-home'));

    expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
  });

  it('should toggle product notifications visibility', async () => {
    const props = {
      account: mockAtlassianCloudAccount,
      product: 'bitbucket' as ProductName,
      productNotifications: mockAtlassifyNotifications,
    };

    await act(async () => {
      render(<ProductNotifications {...props} />);
    });

    fireEvent.click(screen.getByTestId('product-toggle'));

    const tree = render(<ProductNotifications {...props} />);

    expect(tree).toMatchSnapshot();
  });

  it('should mark all product notifications as read', async () => {
    const props = {
      productNotifications: mockAtlassifyNotifications,
    };

    const markNotificationsReadMock = jest.fn();

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

    fireEvent.click(screen.getByTestId('product-mark-as-read'));

    expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
  });
});
