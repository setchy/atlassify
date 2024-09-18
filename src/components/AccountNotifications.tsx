import { type FC, type MouseEvent, useContext, useMemo, useState } from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import Badge from '@atlaskit/badge';
import { BitbucketIcon } from '@atlaskit/logo';
import { AppContext } from '../context/App';
import type { Account, AtlasifyError, AtlasifyNotification } from '../types';
import { markNotificationsAsRead } from '../utils/api/client';
import { openAccountProfile, openMyPullRequests } from '../utils/links';
import { AllRead } from './AllRead';
import { NotificationRow } from './NotificationRow';
import { Oops } from './Oops';
import { ProductNotifications } from './ProductNotifications';
interface IAccountNotifications {
  account: Account;
  notifications: AtlasifyNotification[];
  error: AtlasifyError | null;
}

export const AccountNotifications: FC<IAccountNotifications> = (
  props: IAccountNotifications,
) => {
  const { account, notifications } = props;

  const { settings } = useContext(AppContext);

  const [showAccountNotifications, setShowAccountNotifications] =
    useState(true);

  const accountNotificationIDs = notifications.map(
    (notification) => notification.id,
  );

  const groupedNotifications = Object.values(
    notifications.reduce(
      (acc: { [key: string]: AtlasifyNotification[] }, notification) => {
        const key = notification.product.name;
        if (!acc[key]) acc[key] = [];
        acc[key].push(notification);
        return acc;
      },
      {},
    ),
  );

  const toggleAccountNotifications = () => {
    setShowAccountNotifications(!showAccountNotifications);
  };

  const hasNotifications = useMemo(
    () => notifications.length > 0,
    [notifications],
  );

  const ChevronIcon = !hasNotifications
    ? ChevronLeftIcon
    : showAccountNotifications
      ? ChevronDownIcon
      : ChevronRightIcon;

  const toggleAccountNotificationsLabel = !hasNotifications
    ? 'No notifications for account'
    : showAccountNotifications
      ? 'Hide account notifications'
      : 'Show account notifications';

  return (
    <Stack>
      <Box
        onClick={toggleAccountNotifications}
        paddingInline="space.100"
        paddingBlock="space.050"
        backgroundColor={
          props.error
            ? 'color.background.accent.red.subtler'
            : 'color.background.brand.subtlest'
        }
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Inline space="space.100" alignBlock="center">
            <Tooltip content="Open account profile" position="right">
              <AvatarItem
                avatar={
                  <Avatar
                    name={account.user.name}
                    src={account.user.avatar}
                    size="xsmall"
                    appearance="circle"
                  />
                }
                primaryText={account.user.name}
                onClick={(event: MouseEvent<HTMLElement>) => {
                  // Don't trigger onClick of parent element.
                  event.stopPropagation();
                  openAccountProfile(account);
                }}
              />
            </Tooltip>{' '}
            <Badge appearance="primary">{notifications.length}</Badge>
          </Inline>

          <Inline space="space.100">
            <Tooltip content="My pull requests" position="bottom">
              <IconButton
                label="My pull requests"
                icon={(iconProps) => (
                  <BitbucketIcon {...iconProps} size="xsmall" />
                )}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                onClick={(event: MouseEvent<HTMLElement>) => {
                  // Don't trigger onClick of parent element.
                  event.stopPropagation();
                  openMyPullRequests();
                }}
              />
            </Tooltip>

            <Tooltip
              content="Mark all account notifications as read"
              position="bottom"
            >
              <IconButton
                label="Mark all account notifications as read"
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
                  markNotificationsAsRead(account, accountNotificationIDs);
                }}
              />
            </Tooltip>

            <Tooltip
              content={toggleAccountNotificationsLabel}
              position="bottom"
            >
              <IconButton
                label={toggleAccountNotificationsLabel}
                icon={ChevronIcon}
                shape="circle"
                spacing="compact"
                appearance="subtle"
              />
            </Tooltip>
          </Inline>
        </Flex>
      </Box>

      {showAccountNotifications && (
        <>
          {props.error && <Oops error={props.error} />}
          {!hasNotifications && !props.error && <AllRead />}
          {settings.groupNotificationsByProduct
            ? Object.values(groupedNotifications).map(
                (productNotifications) => {
                  return (
                    <ProductNotifications
                      key={productNotifications[0].product.name}
                      productNotifications={productNotifications}
                    />
                  );
                },
              )
            : notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                />
              ))}
        </>
      )}
    </Stack>
  );
};
