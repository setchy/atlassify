import { type FC, useCallback, useContext, useState } from 'react';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';
import type { AtlassifyNotification } from '../../types';
import { cn } from '../../utils/cn';
import { READ_STATES, getCategoryDetails } from '../../utils/filters';
import {
  formatNotificationFooterText,
  formatNotificationUpdatedAt,
} from '../../utils/helpers';
import { openNotification } from '../../utils/links';

interface INotificationRow {
  notification: AtlassifyNotification;
  isAnimated?: boolean;
}

export const NotificationRow: FC<INotificationRow> = ({
  notification,
  isAnimated = false,
}: INotificationRow) => {
  const { markNotificationsRead, markNotificationsUnread, settings } =
    useContext(AppContext);
  const [animateExit, setAnimateExit] = useState(false);

  const handleNotificationInteraction = useCallback(() => {
    setAnimateExit(
      settings.fetchOnlyUnreadNotifications &&
        !settings.delayNotificationState &&
        settings.markAsReadOnOpen,
    );

    if (settings.markAsReadOnOpen) {
      markNotificationsRead([notification]);
    }

    openNotification(notification);
  }, [notification, markNotificationsRead, settings]);

  const updatedAt = formatNotificationUpdatedAt(notification);

  const categoryDetails = getCategoryDetails(notification.category);
  const CategoryIcon = categoryDetails.icon;
  const CategoryIconProps: Record<string, string> = {
    size: 'small',
  };

  const isNotificationUnread =
    notification.readState === READ_STATES.unread.name; //&& !showAsRead;

  return (
    <div
      id={notification.id}
      className={cn(
        'group flex border-b border-gray-100 bg-white px-3 py-2 hover:bg-gray-100',
        (isAnimated || animateExit) &&
          'translate-x-full opacity-0 transition duration-[350ms] ease-in-out',
      )}
    >
      <div className="mr-3 flex items-center justify-center">
        <Stack space="space.100" alignInline="center">
          <Tooltip content={notification.actor.displayName} position="right">
            <Avatar
              name={notification.actor.displayName}
              src={notification.actor.avatarURL}
              size="small"
            />
          </Tooltip>
          <Tooltip content={categoryDetails.description} position="right">
            <CategoryIcon {...CategoryIconProps} />
          </Tooltip>
        </Stack>
      </div>

      <div
        role="main"
        className="mr-3 flex flex-1 cursor-pointer text-wrap"
        onClick={() => handleNotificationInteraction()}
      >
        <Stack space="space.025">
          <Box>
            <Text>{notification.title}</Text>
            &nbsp;&nbsp;
            <Text size="small" as="em" align="end">
              {updatedAt}
            </Text>
          </Box>
          <Box>
            <Inline space="space.050">
              <Avatar
                name={notification.entity.title}
                src={notification.entity.iconUrl}
                size="xsmall"
                appearance="square"
              />
              <Text size="small">{notification.entity.title}</Text>
            </Inline>
            <Box paddingInlineStart="space.025">
              <Inline space="space.075">
                <notification.product.logo size="xsmall" appearance="brand" />
                <Text size="small">
                  {formatNotificationFooterText(notification)}
                </Text>
              </Inline>
            </Box>
          </Box>
        </Stack>
      </div>

      {!animateExit &&
        (isNotificationUnread ? (
          <Flex alignItems="center">
            <Tooltip content="Mark as read" position="left">
              <IconButton
                label="Mark as read"
                icon={(iconProps) => (
                  <HipchatMediaAttachmentCountIcon
                    {...iconProps}
                    size="small"
                  />
                )}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                onClick={() => {
                  setAnimateExit(
                    settings.fetchOnlyUnreadNotifications &&
                      !settings.delayNotificationState,
                  );
                  markNotificationsRead([notification]);
                }}
                testId="notification-mark-as-read"
              />
            </Tooltip>
          </Flex>
        ) : (
          <Flex alignItems="center">
            <Tooltip content="Mark as unread" position="left">
              <IconButton
                label="Mark as unread"
                icon={() => null}
                shape="circle"
                spacing="compact"
                appearance="subtle"
                onClick={() => {
                  markNotificationsUnread([notification]);
                }}
                testId="notification-mark-as-unread"
              />
            </Tooltip>
          </Flex>
        ))}
    </div>
  );
};
