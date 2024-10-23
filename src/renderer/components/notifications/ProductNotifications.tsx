import { type FC, type MouseEvent, useContext, useState } from 'react';

import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';
import type { AtlassifyNotification } from '../../types';
import { openExternalLink } from '../../utils/comms';
import { formatProperCase, getChevronDetails } from '../../utils/helpers';
import { getProductDetails } from '../../utils/products';
import { isLightMode } from '../../utils/theme';
import { NotificationRow } from './NotificationRow';

interface IProductNotifications {
  productNotifications: AtlassifyNotification[];
}

export const ProductNotifications: FC<IProductNotifications> = ({
  productNotifications,
}) => {
  const { markNotificationsRead, settings } = useContext(AppContext);

  const [animateExit, setAnimateExit] = useState(false);
  const [showProductNotifications, setShowProductNotifications] =
    useState(true);

  const productNotification = productNotifications[0].product;
  const productDetails = getProductDetails(productNotification.name);

  const toggleProductNotifications = () => {
    setShowProductNotifications(!showProductNotifications);
  };

  const Chevron = getChevronDetails(true, showProductNotifications, 'product');

  return (
    <Stack>
      <Box
        onClick={toggleProductNotifications}
        paddingInlineStart="space.050"
        paddingInlineEnd="space.100"
        paddingBlock="space.050"
        backgroundColor={
          isLightMode()
            ? 'color.background.accent.blue.subtlest'
            : 'color.background.accent.gray.subtlest'
        }
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Tooltip
            content={
              productDetails.home
                ? `Open ${formatProperCase(productDetails.name)}`
                : ''
            }
            position="right"
          >
            <Button
              appearance="subtle"
              onClick={(event: MouseEvent<HTMLElement>) => {
                if (productDetails.home) {
                  // Don't trigger onClick of parent element.
                  event.stopPropagation();
                  openExternalLink(productDetails.home);
                }
              }}
              testId="product-home"
            >
              <Inline space="space.100" alignBlock="center">
                <productNotification.logo size="xsmall" appearance="brand" />
                <span className="capitalize">{productNotification.name}</span>
                <Badge max={false}>{productNotifications.length}</Badge>
              </Inline>{' '}
            </Button>
          </Tooltip>

          <Inline space="space.100">
            <Tooltip
              content="Mark all product notifications as read"
              position="bottom"
            >
              <IconButton
                label="Mark all product notifications as read"
                icon={(iconProps) => (
                  <HipchatMediaAttachmentCountIcon
                    {...iconProps}
                    size="small"
                  />
                )}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                onClick={(event: MouseEvent<HTMLElement>) => {
                  // Don't trigger onClick of parent element.
                  event.stopPropagation();
                  setAnimateExit(
                    settings.fetchOnlyUnreadNotifications &&
                      !settings.delayNotificationState,
                  );
                  markNotificationsRead(productNotifications);
                }}
                testId="product-mark-as-read"
              />
            </Tooltip>

            <Tooltip content={Chevron.label} position="bottom">
              <IconButton
                label={Chevron.label}
                icon={Chevron.icon}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                testId="product-toggle"
              />
            </Tooltip>
          </Inline>
        </Flex>
      </Box>

      {showProductNotifications &&
        productNotifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
            isAnimated={animateExit}
          />
        ))}
    </Stack>
  );
};
