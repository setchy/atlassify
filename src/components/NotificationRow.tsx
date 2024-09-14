import { type FC, useCallback, useContext, useState } from 'react';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../context/App';
import { type AtlasifyNotification, Opacity } from '../types';
import { cn } from '../utils/cn';
import {
  formatNotificationUpdatedAt,
  formatProperCase,
} from '../utils/helpers';
import { openNotification } from '../utils/links';
import { HoverGroup } from './HoverGroup';

interface INotificationRow {
  notification: AtlasifyNotification;
  isAnimated?: boolean;
  isRead?: boolean;
}

export const NotificationRow: FC<INotificationRow> = ({
  notification,
  isAnimated = false,
  isRead = false,
}: INotificationRow) => {
  const { settings, markNotificationRead } = useContext(AppContext);
  const [animateExit, setAnimateExit] = useState(false);
  const [showAsRead, setShowAsRead] = useState(false);

  const handleNotification = useCallback(() => {
    setAnimateExit(!settings.delayNotificationState);

    if (settings.markAsReadOnOpen) {
      setShowAsRead(settings.delayNotificationState);
      markNotificationRead(notification);
    }

    openNotification(notification);
  }, [notification, markNotificationRead, settings]);

  const updatedAt = formatNotificationUpdatedAt(notification);

  return (
    <div
      id={notification.id}
      className={cn(
        'group flex border-b border-gray-100 bg-white px-3 py-2 hover:bg-gray-100 dark:border-gray-darker dark:bg-gray-dark dark:text-white dark:hover:bg-gray-darker',
        (isAnimated || animateExit) &&
          'translate-x-full opacity-0 transition duration-[350ms] ease-in-out',
        (isRead || showAsRead) && Opacity.READ,
      )}
    >
      <div className="mr-3 flex items-center justify-center">
        <Tooltip content={notification.actor.displayName}>
          <Avatar
            name={notification.actor.displayName}
            src={notification.actor.avatarURL}
            size="small"
          />
        </Tooltip>
      </div>

      <div
        className="mr-3 flex flex-1 cursor-pointer text-wrap"
        onClick={() => handleNotification()}
      >
        <div className="flex flex-col gap-1">
          <div
            className="text-sm"
            role="main"
            title={notification.title.trim()}
          >
            {notification.title}
            <span
              className="pl-2 text-xs text-gray-700"
              title={`Updated ${updatedAt}`}
            >
              {updatedAt}
            </span>
          </div>

          <div
            className={cn(
              'flex flex-1 items-center gap-1 text-xs',
              Opacity.MEDIUM,
            )}
          >
            <Avatar
              name={notification.entity.title}
              src={notification.entity.iconUrl}
              size="xsmall"
              appearance="square"
            />
            {notification.entity.title}
          </div>

          <div
            className={cn(
              'flex flex-1 items-center pl-0.5 gap-1.5 text-xs',
              Opacity.MEDIUM,
            )}
          >
            <notification.product.icon size="xsmall" appearance="brand" />
            {notification.path?.title ??
              formatProperCase(notification.product.name)}
          </div>
        </div>
      </div>

      {!animateExit && (
        <HoverGroup>
          {notification.unread && (
            <IconButton
              icon={(iconProps) => (
                <HipchatMediaAttachmentCountIcon {...iconProps} size="small" />
              )}
              label="Mark as read"
              isTooltipDisabled={false}
              shape="circle"
              spacing="compact"
              appearance="subtle"
              onClick={() => {
                setAnimateExit(!settings.delayNotificationState);
                setShowAsRead(settings.delayNotificationState);
                markNotificationRead(notification);
              }}
            />
          )}
        </HoverGroup>
      )}
    </div>
  );
};
