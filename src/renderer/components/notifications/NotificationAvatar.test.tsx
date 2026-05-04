import { renderWithProviders } from '../../__helpers__/test-utils';
import { mockSingleAtlassifyNotification } from '../../__mocks__/notifications-mocks';

import { PRODUCTS } from '../../utils/products';
import {
  NotificationAvatar,
  type NotificationAvatarProps,
} from './NotificationAvatar';

describe('renderer/components/notifications/NotificationAvatar.tsx', () => {
  it('renders actor avatar with circle appearance', () => {
    const props: NotificationAvatarProps = {
      notification: mockSingleAtlassifyNotification,
      avatarAppearance: 'circle',
    };

    const tree = renderWithProviders(<NotificationAvatar {...props} />);

    expect(tree.container).toMatchSnapshot();
  });

  it('renders actor avatar with square appearance', () => {
    const props: NotificationAvatarProps = {
      notification: {
        ...mockSingleAtlassifyNotification,
        product: PRODUCTS.compass,
        message: 'some-project improved a scorecard',
      },
      avatarAppearance: 'square',
    };

    const tree = renderWithProviders(<NotificationAvatar {...props} />);

    expect(tree.container).toMatchSnapshot();
  });
});
