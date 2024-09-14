import { type FC, type MouseEvent, useContext, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';

import { AppContext } from '../context/App';
import { type AtlasifyNotification, Opacity } from '../types';
import { cn } from '../utils/cn';
import { HoverGroup } from './HoverGroup';
import { NotificationRow } from './NotificationRow';
import { markNotificationsAsRead } from '../utils/api/client';

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
    <>
      <div
        className="group flex justify-between bg-gray-100 px-3 py-1.5 dark:bg-gray-darker dark:text-white"
        onClick={toggleProductNotifications}
      >
        <div
          className={cn(
            'flex flex-1 gap-3 items-center truncate text-sm font-medium',
            animateExit &&
              'translate-x-full opacity-0 transition duration-[350ms] ease-in-out',
            showAsRead ? Opacity.READ : Opacity.MEDIUM,
          )}
        >
          <productNotification.icon size="xsmall" appearance="brand" />
          <span className="capitalize">{productNotification.name}</span>
        </div>

        {!animateExit && (
          <HoverGroup>
            <IconButton
              icon={(iconProps) => (
                <HipchatMediaAttachmentCountIcon {...iconProps} size="small" />
              )}
              label="Mark all product notifications as read"
              isTooltipDisabled={false}
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
              icon={ChevronIcon}
              label={toggleProductNotificationsLabel}
              isTooltipDisabled={false}
              shape="circle"
              spacing="compact"
              appearance="subtle"
            />
          </HoverGroup>
        )}
      </div>

      {showProductNotifications &&
        productNotifications.map((notification) => (
          <NotificationRow
            key={notification.id}
            notification={notification}
            isAnimated={animateExit}
            isRead={showAsRead}
          />
        ))}
    </>
  );
};
