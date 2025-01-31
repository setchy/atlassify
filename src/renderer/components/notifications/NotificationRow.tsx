import { type FC, useCallback, useContext, useState } from 'react';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import HipchatMediaAttachmentCountIcon from '@atlaskit/icon/glyph/hipchat/media-attachment-count';
import { Box, Flex, Inline, Stack, Text } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';
import type { AtlassifyNotification } from '../../types';
import { cn } from '../../utils/cn';

import { IconTile } from '@atlaskit/icon';
import {
  formatNotificationFooterText,
  formatNotificationUpdatedAt,
} from '../../utils/helpers';
import { openNotification } from '../../utils/links';
import { getCategoryFilterDetails } from '../../utils/notifications/filters/category';
import { filterNotificationByReadState } from '../../utils/notifications/filters/readState';

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

  const categoryDetails = getCategoryFilterDetails(notification.category);
  const CategoryIcon = categoryDetails.icon;

  const isNotificationUnread = filterNotificationByReadState(
    notification,
    'unread',
  );

  return (
    <div
      id={notification.id}
      className={cn(
        'group flex pl-3 pr-2 py-2',
        'border-b border-atlassify-notifications hover:bg-atlassify-notifications',
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
            <IconTile
              icon={CategoryIcon}
              label={categoryDetails.description}
              appearance="gray"
              shape="square"
              size="16"
            />
          </Tooltip>
        </Stack>
      </div>

      <div
        className="flex flex-1 cursor-pointer text-wrap"
        onClick={() => handleNotificationInteraction()}
        onKeyDown={() => handleNotificationInteraction()}
        data-testid="notification-row"
        role="button"
        tabIndex={0}
      >
        <Stack space="space.025">
          <Box>
            <Text>{notification.message}</Text>
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
