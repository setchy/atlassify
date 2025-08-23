import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockAtlassifyNotifications } from '../../__mocks__/notifications-mocks';
import { mockSettings } from '../../__mocks__/state-mocks';
import { AppContext } from '../../context/App';
import * as comms from '../../utils/comms';
import * as theme from '../../utils/theme';
import {
  type IProductNotifications,
  ProductNotifications,
} from './ProductNotifications';

jest.mock('./NotificationRow', () => ({
  NotificationRow: () => <div>NotificationRow</div>,
}));

const openExternalLinkMock = jest
  .spyOn(comms, 'openExternalLink')
  .mockImplementation();

describe('renderer/components/notifications/ProductNotifications.tsx', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render itself & its children - light mode', () => {
    jest.spyOn(theme, 'isLightMode').mockReturnValue(true);

    const props: IProductNotifications = {
      productNotifications: mockAtlassifyNotifications,
    };

    const tree = render(
      <AppContext.Provider value={{}}>
        <ProductNotifications {...props} />
      </AppContext.Provider>,
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render itself & its children - dark mode', () => {
    jest.spyOn(theme, 'isLightMode').mockReturnValue(false);

    const props: IProductNotifications = {
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
    // Use a notification whose product has a home URL (e.g. bitbucket)
    const mockBitbucketNotification = mockAtlassifyNotifications[0];
    expect(mockBitbucketNotification.product.type).toBe('bitbucket');

    const props: IProductNotifications = {
      productNotifications: [mockBitbucketNotification],
    };

    await act(async () => {
      render(<ProductNotifications {...props} />);
    });

    await userEvent.click(screen.getByTestId('product-home'));

    expect(openExternalLinkMock).toHaveBeenCalledTimes(1);
  });

  it('should not open product home and have empty tooltip content when home is unavailable', async () => {
    // Use a notification whose product has no home URL (e.g. confluence)
    const mockConfluenceNotification = mockAtlassifyNotifications[1];
    expect(mockConfluenceNotification.product.type).toBe('confluence');

    await act(async () => {
      render(
        <ProductNotifications
          productNotifications={[mockConfluenceNotification]}
        />,
      );
    });

    await userEvent.click(screen.getByTestId('product-home'));

    expect(openExternalLinkMock).not.toHaveBeenCalled();
  });

  it('should toggle product notifications visibility', async () => {
    const props: IProductNotifications = {
      productNotifications: mockAtlassifyNotifications,
    };

    await act(async () => {
      render(<ProductNotifications {...props} />);
    });

    await userEvent.click(screen.getByTestId('product-toggle'));

    const tree = render(<ProductNotifications {...props} />);

    expect(tree).toMatchSnapshot();
  });

  it('should mark all product notifications as read', async () => {
    const props: IProductNotifications = {
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

    await userEvent.click(screen.getByTestId('product-mark-as-read'));

    expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
  });
});
