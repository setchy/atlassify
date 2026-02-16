import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppContext } from '../../__helpers__/test-utils';
import { mockAtlassifyNotifications } from '../../__mocks__/notifications-mocks';

import * as comms from '../../utils/comms';
import * as theme from '../../utils/theme';
import {
  ProductNotifications,
  type ProductNotificationsProps,
} from './ProductNotifications';

vi.mock('./NotificationRow', () => ({
  NotificationRow: () => <div>NotificationRow</div>,
}));

const openExternalLinkSpy = vi
  .spyOn(comms, 'openExternalLink')
  .mockImplementation(vi.fn());

describe('renderer/components/notifications/ProductNotifications.tsx', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render itself & its children - light mode', () => {
    vi.spyOn(theme, 'isLightMode').mockReturnValue(true);

    const props: ProductNotificationsProps = {
      productNotifications: mockAtlassifyNotifications,
    };

    const tree = renderWithAppContext(<ProductNotifications {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('should render itself & its children - dark mode', () => {
    vi.spyOn(theme, 'isLightMode').mockReturnValue(false);

    const props: ProductNotificationsProps = {
      productNotifications: mockAtlassifyNotifications,
    };

    const tree = renderWithAppContext(<ProductNotifications {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('should open product home when available', async () => {
    // Use a notification whose product has a home URL (e.g. bitbucket)
    const mockBitbucketNotification = mockAtlassifyNotifications[0];
    expect(mockBitbucketNotification.product.type).toBe('bitbucket');

    const props: ProductNotificationsProps = {
      productNotifications: [mockBitbucketNotification],
    };

    await act(async () => {
      renderWithAppContext(<ProductNotifications {...props} />);
    });

    await userEvent.click(screen.getByTestId('product-home'));

    expect(openExternalLinkSpy).toHaveBeenCalledTimes(1);
  });

  it('should not open product home and have empty tooltip content when home is unavailable', async () => {
    // Use a notification whose product has no home URL (e.g. confluence)
    const mockConfluenceNotification = mockAtlassifyNotifications[1];
    expect(mockConfluenceNotification.product.type).toBe('confluence');

    await act(async () => {
      renderWithAppContext(
        <ProductNotifications
          productNotifications={[mockConfluenceNotification]}
        />,
      );
    });

    await userEvent.click(screen.getByTestId('product-home'));

    expect(openExternalLinkSpy).not.toHaveBeenCalled();
  });

  it('should toggle product notifications visibility', async () => {
    const props: ProductNotificationsProps = {
      productNotifications: mockAtlassifyNotifications,
    };

    await act(async () => {
      renderWithAppContext(<ProductNotifications {...props} />);
    });

    await userEvent.click(screen.getByTestId('product-toggle'));

    const tree = renderWithAppContext(<ProductNotifications {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('should mark all product notifications as read', async () => {
    const props: ProductNotificationsProps = {
      productNotifications: mockAtlassifyNotifications,
    };

    const markNotificationsReadMock = vi.fn();

    renderWithAppContext(<ProductNotifications {...props} />, {
      markNotificationsRead: markNotificationsReadMock,
    });

    await userEvent.click(screen.getByTestId('product-mark-as-read'));

    expect(markNotificationsReadMock).toHaveBeenCalledTimes(1);
  });
});
