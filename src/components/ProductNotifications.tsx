import { type FC, type MouseEvent, useContext, useState } from 'react';

import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives';

import { AppContext } from '../context/App';
import type { AtlasifyNotification } from '../types';
import { markNotificationsAsRead } from '../utils/api/client';
import { openExternalLink } from '../utils/comms';
import { getProductDetails } from '../utils/products';
import { NotificationRow } from './NotificationRow';

interface IProductNotifications {
  productNotifications: AtlasifyNotification[];
}

export const ProductNotifications: FC<IProductNotifications> = ({
  productNotifications,
}) => {
  const { settings } = useContext(AppContext);

  const [animateExit, setAnimateExit] = useState(false);
  const [showAsRead, setShowAsRead] = useState(false);
  const [showProductNotifications, setShowProductNotifications] =
    useState(true);

  const productNotification = productNotifications[0].product;
  const productDetails = getProductDetails(productNotification.name);

  const productNotificationIDs = productNotifications.map(
    (notification) => notification.id,
  );

  const toggleProductNotifications = () => {
    setShowProductNotifications(!showProductNotifications);
  };

  const ChevronIcon = showProductNotifications
    ? ChevronDownIcon
    : ChevronUpIcon;

  const toggleProductNotificationsLabel = showProductNotifications
    ? 'Hide product notifications'
    : 'Show product notifications';

  return (
    <Stack>
      <Box
        onClick={toggleProductNotifications}
        paddingInlineStart="space.200"
        paddingInlineEnd="space.100"
        paddingBlock="space.050"
        backgroundColor="color.background.brand.subtlest.hovered"
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Button
            onClick={(event: MouseEvent<HTMLElement>) => {
              if (productDetails.home) {
                // Don't trigger onClick of parent element.
                event.stopPropagation();
                openExternalLink(productDetails.home);
              }
            }}
          >
            <Inline space="space.100" alignBlock="center">
              <productNotification.icon size="xsmall" appearance="brand" />
              <span className="capitalize">{productNotification.name}</span>
              <Badge>{productNotifications.length}</Badge>
            </Inline>{' '}
          </Button>

          <Inline space="space.100">
            <IconButton
              label="Mark all product notifications as read"
              title="Mark all product notifications as read"
              icon={(iconProps) => (
                <HipchatMediaAttachmentCountIcon {...iconProps} size="small" />
              )}
              shape="circle"
              spacing="compact"
              appearance="subtle"
              onClick={(event: MouseEvent<HTMLElement>) => {
                // Don't trigger onClick of parent element.
                event.stopPropagation();
                setAnimateExit(!settings.delayNotificationState);
                setShowAsRead(settings.delayNotificationState);
                markNotificationsAsRead(
                  productNotifications[0].account,
                  productNotificationIDs,
                );
              }}
            />

            <IconButton
              label={toggleProductNotificationsLabel}
              title={toggleProductNotificationsLabel}
              icon={ChevronIcon}
              shape="circle"
              spacing="compact"
              appearance="subtle"
            />
          </Inline>
        </Flex>
      </Box>

      {showProductNotifications &&
        productNotifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
            isAnimated={animateExit}
            isRead={showAsRead}
          />
        ))}
    </Stack>
  );
};
