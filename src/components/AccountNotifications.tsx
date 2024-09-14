import { type FC, type MouseEvent, useContext, useMemo, useState } from 'react';

import Toggle from '@atlaskit/toggle';
import Tooltip from '@atlaskit/tooltip';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/glyph/chevron-left';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import { IconButton } from '@atlaskit/button/new';
import Avatar from '@atlaskit/avatar';

import { AppContext } from '../context/App';
import {
  type Account,
  type AtlasifyError,
  type AtlasifyNotification,
  Opacity,
} from '../types';
import { cn } from '../utils/cn';
import { openAccountProfile } from '../utils/links';
import { AllRead } from './AllRead';
import { HoverGroup } from './HoverGroup';
import { NotificationRow } from './NotificationRow';
import { Oops } from './Oops';
import { ProductNotifications } from './ProductNotifications';
interface IAccountNotifications {
  account: Account;
  notifications: AtlasifyNotification[];
  error: AtlasifyError | null;
  showAccountHeader: boolean;
}

export const AccountNotifications: FC<IAccountNotifications> = (
  props: IAccountNotifications,
) => {
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const { account, showAccountHeader, notifications } = props;

  const { settings } = useContext(AppContext);

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

  const groupByProduct = settings.groupBy === 'PRODUCT';

  return (
    <>
      {showAccountHeader && (
        <div
          className={cn(
            'group flex items-center justify-between px-3 py-1.5 text-sm font-semibold dark:text-white',
            props.error
              ? 'bg-red-300 dark:bg-red-500'
              : 'bg-gray-300 dark:bg-gray-darkest',
            Opacity.LOW,
          )}
          onClick={toggleAccountNotifications}
        >
          <div className="flex">
            <button
              type="button"
              onClick={(event: MouseEvent<HTMLElement>) => {
                // Don't trigger onClick of parent element.
                event.stopPropagation();
                openAccountProfile(account);
              }}
            >
              <div className="flex">
                <Tooltip content={account.user.name}>
                  <Avatar
                    name={account.user.name}
                    src={account.user.avatar}
                    size="xsmall"
                    appearance="circle"
                  />
                </Tooltip>
                <span className="ml-2">{account.user.login}</span>
              </div>
            </button>
          </div>

          <Tooltip content={showOnlyUnread ? 'Show all' : 'Only show unread'}>
            <Toggle
              id="toggle-default"
              size="regular"
              label="Show unread"
              onChange={() => setShowOnlyUnread((prev) => !prev)}
            />
          </Tooltip>

          <HoverGroup>
            <IconButton
              icon={ChevronIcon}
              label={toggleAccountNotificationsLabel}
              isTooltipDisabled={false}
              shape="circle"
              spacing="compact"
              appearance="subtle"
            />
          </HoverGroup>
        </div>
      )}

      {showAccountNotifications && (
        <>
          {props.error && <Oops error={props.error} />}
          {!hasNotifications && !props.error && <AllRead />}
          {groupByProduct
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
    </>
  );
};
