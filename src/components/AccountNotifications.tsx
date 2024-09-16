import { type FC, type MouseEvent, useContext, useMemo, useState } from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../context/App';
import type { Account, AtlasifyError, AtlasifyNotification } from '../types';
import { openAccountProfile, openMyPullRequests } from '../utils/links';
import { AllRead } from './AllRead';
import { NotificationRow } from './NotificationRow';
import { Oops } from './Oops';
import { ProductNotifications } from './ProductNotifications';
import { BitbucketIcon } from '@atlaskit/logo';
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
      : ChevronUpIcon;

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
            : 'color.background.neutral'
        }
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Tooltip content="Open account profile">
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
          </Tooltip>

          <Inline space="space.100">
            <IconButton
              label="My pull requests"
              title="My pull requests"
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
            <IconButton
              label={toggleAccountNotificationsLabel}
              title={toggleAccountNotificationsLabel}
              icon={ChevronIcon}
              shape="circle"
              spacing="compact"
              appearance="subtle"
            />
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
