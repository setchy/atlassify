import { type FC, type MouseEvent, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import { Box, Flex, Inline, Stack, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';

import type { AtlassifyNotification } from '../../types';

import { openExternalLink } from '../../utils/comms';
import { getChevronDetails } from '../../utils/helpers';
import { isLightMode } from '../../utils/theme';
import { NotificationRow } from './NotificationRow';

export interface ProductNotificationsProps {
  productNotifications: AtlassifyNotification[];
}

export const ProductNotifications: FC<ProductNotificationsProps> = ({
  productNotifications,
}) => {
  const { markNotificationsRead, settings } = useContext(AppContext);
  const { t } = useTranslation();

  const [animateExit, setAnimateExit] = useState(false);
  const [showProductNotifications, setShowProductNotifications] =
    useState(true);

  // We assume that productNotifications are all of the same product-type, as grouped within AccountNotifications
  const productNotification = productNotifications[0].product;

  const toggleProductNotifications = () => {
    setShowProductNotifications(!showProductNotifications);
  };

  const Chevron = getChevronDetails(true, showProductNotifications, 'product');
  const ChevronIcon = Chevron.icon;

  const boxStyles = xcss({
    transitionDuration: '200ms',
    ':hover': {
      backgroundColor: isLightMode()
        ? 'color.background.accent.blue.subtlest.hovered'
        : 'color.background.accent.gray.subtlest.hovered',
    },
  });

  return (
    <Stack>
      <Box
        as="div"
        backgroundColor={
          isLightMode()
            ? 'color.background.accent.blue.subtlest'
            : 'color.background.accent.gray.subtlest'
        }
        onClick={toggleProductNotifications}
        paddingBlock="space.050"
        paddingInlineEnd="space.100"
        paddingInlineStart="space.050"
        xcss={boxStyles}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Tooltip
            content={
              productNotification.home
                ? t('notifications.product.open_product', {
                    name: productNotification.display,
                  })
                : ''
            }
            position="right"
          >
            <Button
              appearance="subtle"
              onClick={(event: MouseEvent<HTMLElement>) => {
                if (productNotification.home) {
                  // Don't trigger onClick of parent element.
                  event.stopPropagation();
                  openExternalLink(productNotification.home);
                }
              }}
              testId="product-home"
            >
              <Inline alignBlock="center" space="space.100">
                <productNotification.logo
                  appearance="brand"
                  shouldUseNewLogoDesign
                  size="xxsmall"
                />
                <span className="font-medium">
                  {productNotification.display}
                </span>
                <Badge max={false}>{productNotifications.length}</Badge>
              </Inline>{' '}
            </Button>
          </Tooltip>

          <Inline space="space.100">
            <Tooltip
              content={t('notifications.product.mark_all_read')}
              position="bottom"
            >
              <IconButton
                appearance="subtle"
                icon={() => <StrokeWeightLargeIcon label="" />}
                label={t('notifications.product.mark_all_read')}
                onClick={(event: MouseEvent<HTMLElement>) => {
                  // Don't trigger onClick of parent element.
                  event.stopPropagation();
                  setAnimateExit(
                    settings.fetchOnlyUnreadNotifications &&
                      !settings.delayNotificationState,
                  );
                  markNotificationsRead(productNotifications);
                }}
                shape="circle"
                spacing="compact"
                testId="product-mark-as-read"
              />
            </Tooltip>

            <Tooltip content={Chevron.label} position="bottom">
              <IconButton
                appearance="subtle"
                icon={(iconProps) => (
                  <ChevronIcon {...iconProps} size="small" />
                )}
                label={Chevron.label}
                shape="circle"
                spacing="compact"
                testId="product-toggle"
              />
            </Tooltip>
          </Inline>
        </Flex>
      </Box>

      {showProductNotifications &&
        productNotifications.map((notification) => (
          <NotificationRow
            isAnimated={animateExit}
            key={notification.id}
            notification={notification}
          />
        ))}
    </Stack>
  );
};
