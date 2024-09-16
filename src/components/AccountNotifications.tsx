import { type FC, type MouseEvent, useContext, useMemo, useState } from 'react';

import Avatar, { AvatarItem } from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import ListIcon from '@atlaskit/icon/glyph/list';
import { Box, Flex, Inline, Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../context/App';
import type { Account, AtlasifyError, AtlasifyNotification } from '../types';
import { openAccountProfile } from '../utils/links';
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

  const { settings, updateSetting, fetchNotifications } =
    useContext(AppContext);

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

  const hasNotifications = useMemo(
    () => notifications.length > 0,
    [notifications],
  );

  const [showAccountNotifications, setShowAccountNotifications] =
    useState(true);

  const toggleAccountNotifications = () => {
    setShowAccountNotifications(!showAccountNotifications);
  };

  const ChevronIcon =
    notifications.length === 0
      ? ChevronLeftIcon
      : showAccountNotifications
        ? ChevronDownIcon
        : ChevronUpIcon;

  const toggleAccountNotificationsLabel =
    notifications.length === 0
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
          <Inline space="space.100" alignInline="center">
            <Tooltip
              content={`${account.user.name}
              (${account.user.login})`}
            >
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
          </Inline>

          <Inline space="space.100" alignInline="center">
            <Tooltip content="Show only unread notifications">
              <Toggle
                id="toggle-unread-only"
                size="regular"
                label="Show only unread toggle"
                isChecked={settings.fetchOnlyUnreadNotifications}
                onChange={(evt) => {
                  updateSetting(
                    'fetchOnlyUnreadNotifications',
                    evt.target.checked,
                  );
                  fetchNotifications();
                }}
              />
            </Tooltip>

            <IconButton
              label="Group notifications by products"
              isTooltipDisabled={false}
              icon={() => <ListIcon label="groupByProduct" size="small" />}
              onClick={(event: MouseEvent<HTMLElement>) => {
                // Don't trigger onClick of parent element.
                event.stopPropagation();

                updateSetting(
                  'groupNotificationsByProduct',
                  !settings.groupNotificationsByProduct,
                );
              }}
              appearance={
                settings.groupNotificationsByProduct ? 'discovery' : 'subtle'
              }
              spacing="compact"
              shape="circle"
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
