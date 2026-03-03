import { type FC, type MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Badge from '@atlaskit/badge';
import Button, { IconButton } from '@atlaskit/button/new';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import { Box, Flex, Inline, Stack, xcss } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { useAppContext } from '../../hooks/useAppContext';

import type { AtlassifyNotification } from '../../types';

import { shouldRemoveNotificationsFromState } from '../../utils/notifications/postProcess';
import { openExternalLink } from '../../utils/system/comms';
import { getChevronDetails } from '../../utils/ui/display';
import { isLightMode } from '../../utils/ui/theme';
import { NotificationRow } from './NotificationRow';

export interface ProductNotificationsProps {
  productNotifications: AtlassifyNotification[];
}

export const ProductNotifications: FC<ProductNotificationsProps> = ({
  productNotifications,
}) => {
  const { t } = useTranslation();

  const { markNotificationsRead } = useAppContext();

  const [shouldAnimateProductExit, setShouldAnimateProductExit] =
    useState(false);
  const [pendingMarkAsRead, setPendingMarkAsRead] = useState(false);
  const [isProductNotificationsVisible, setIsProductNotificationsVisible] =
    useState(true);

  // We assume that productNotifications are all of the same product-type, as grouped within AccountNotifications
  const productNotification = productNotifications[0].product;
  const shouldAnimateExit = shouldRemoveNotificationsFromState();

  const actionProductInteraction = () => {
    openExternalLink(productNotification.home);
  };

  const actionMarkAsRead = () => {
    if (shouldAnimateExit) {
      // Trigger animation, mark as read after animation completes
      setShouldAnimateProductExit(true);
      setPendingMarkAsRead(true);
    } else {
      // No animation needed, mark as read immediately
      markNotificationsRead(productNotifications);
    }
  };

  const handleProductTransitionEnd = () => {
    // After animation completes, execute pending mutation if any
    if (pendingMarkAsRead) {
      setPendingMarkAsRead(false);
      markNotificationsRead(productNotifications);
    }
  };

  const actionToggleProductNotifications = () => {
    setIsProductNotificationsVisible(!isProductNotificationsVisible);
  };

  const Chevron = getChevronDetails(
    true,
    isProductNotificationsVisible,
    'product',
  );
  const ChevronIcon = Chevron.icon;

  const boxStyles = xcss({
    transitionDuration: '200ms',

    backgroundColor: isLightMode()
      ? 'color.background.accent.blue.subtlest'
      : 'color.background.accent.gray.subtlest',

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
        onClick={actionToggleProductNotifications}
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
                  actionProductInteraction();
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
              </Inline>
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
                  actionMarkAsRead();
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

      {isProductNotificationsVisible && (
        <div
          className={
            shouldAnimateProductExit
              ? 'translate-x-full opacity-0 transition duration-350 ease-in-out'
              : ''
          }
          data-testid="product-notifications-wrapper"
          onTransitionEnd={handleProductTransitionEnd}
        >
          {productNotifications.map((notification) => (
            <NotificationRow
              isProductAnimatingExit={shouldAnimateProductExit}
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </Stack>
  );
};
