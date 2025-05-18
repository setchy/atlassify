import { type FC, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from '@atlaskit/avatar';
import { IconButton } from '@atlaskit/button/new';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';
import type { AtlassifyNotification } from '../../types';
import { cn } from '../../utils/cn';

import Badge from '@atlaskit/badge';
import {
  formatNotificationFooterText,
  formatNotificationUpdatedAt,
} from '../../utils/helpers';
import { openNotification } from '../../utils/links';
import {
  categoryFilter,
  readStateFilter,
} from '../../utils/notifications/filters';
import { UnreadIcon } from '../icons/UnreadIcon';

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

  const { t } = useTranslation();

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

  const categoryDetails = categoryFilter.getTypeDetails(notification.category);
  const CategoryIcon = categoryDetails.icon;

  const isNotificationUnread = readStateFilter.filterNotification(
    notification,
    'unread',
  );

  const spaceBetweenSections = 'space.100';

  return (
    <div
      id={notification.id}
      className={cn(
        'border-b border-atlassify-notifications hover:bg-atlassify-notifications',
        (isAnimated || animateExit) &&
          'translate-x-full opacity-0 transition duration-[350ms] ease-in-out',
      )}
    >
      <Box padding="space.100">
        <Inline space={spaceBetweenSections} alignBlock="center">
          <Inline space={spaceBetweenSections} grow="fill" alignBlock="start">
            <Box id="notification-avatar">
              <Stack space="space.050" alignInline="center">
                <Tooltip
                  content={notification.actor.displayName}
                  position="right"
                >
                  <Avatar
                    name={notification.actor.displayName}
                    src={notification.actor.avatarURL}
                    size="medium"
                    appearance={
                      // The Compass System Actor Icons look much better in square form than circle
                      notification.product.name === 'compass' &&
                      notification.message.includes('a scorecard')
                        ? 'square'
                        : 'circle'
                    }
                  />
                </Tooltip>
                <Tooltip content={categoryDetails.description} position="right">
                  <CategoryIcon label={categoryDetails.description} />
                </Tooltip>
              </Stack>
            </Box>

            <Inline grow="fill">
              <Box
                id="notification-details"
                onClick={handleNotificationInteraction}
                testId="notification-details"
              >
                <div className="cursor-pointer">
                  <Stack space="space.025">
                    <Box id="notification-title">
                      <Text>{notification.message}</Text>
                      &nbsp;&nbsp;
                      <Text size="small" as="em" align="end">
                        {updatedAt}
                        {notification.matchingNotificationIDs.length > 0 && (
                          <>
                            &nbsp;&nbsp;
                            <Badge appearance="default">
                              {notification.matchingNotificationIDs.length}
                            </Badge>
                          </>
                        )}
                      </Text>
                    </Box>
                    <Box id="notification-metadata">
                      <Box id="notification-entity">
                        <Inline space="space.050">
                          <Avatar
                            name={notification.entity.title}
                            src={notification.entity.iconUrl}
                            size="xsmall"
                            appearance="square"
                          />
                          <Text size="small">{notification.entity.title}</Text>
                        </Inline>
                      </Box>
                      <Box
                        id="notification-product"
                        paddingInlineStart="space.025"
                      >
                        <Inline space="space.075">
                          <notification.product.logo
                            size="xsmall"
                            appearance="brand"
                          />
                          <Text size="small">
                            {formatNotificationFooterText(notification)}
                          </Text>
                        </Inline>
                      </Box>
                    </Box>
                  </Stack>
                </div>
              </Box>
            </Inline>
          </Inline>

          <Box id="notification-actions">
            {!animateExit &&
              (isNotificationUnread ? (
                <Tooltip
                  content={t('notifications.interactions.mark_as_read')}
                  position="left"
                >
                  <IconButton
                    label={t('notifications.interactions.mark_as_read')}
                    icon={() => <UnreadIcon color="brand" />}
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
              ) : (
                <Tooltip
                  content={t('notifications.interactions.mark_as_unread')}
                  position="left"
                >
                  <IconButton
                    label={t('notifications.interactions.mark_as_unread')}
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
              ))}
          </Box>
        </Inline>
      </Box>
    </div>
  );
};
