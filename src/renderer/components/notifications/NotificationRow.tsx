import { type FC, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Avatar, { type AppearanceType } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import { IconButton } from '@atlaskit/button/new';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';

import type { AtlassifyNotification } from '../../types';

import { cn } from '../../utils/cn';
import {
  blockAlignmentByLength,
  formatNotificationBodyText,
  formatNotificationFooterText,
  formatNotificationUpdatedAt,
  isCompassScorecardNotification,
} from '../../utils/helpers';
import { openNotification } from '../../utils/links';
import {
  categoryFilter,
  readStateFilter,
} from '../../utils/notifications/filters';

export interface NotificationRowProps {
  notification: AtlassifyNotification;
  isAnimated?: boolean;
  isSelected?: boolean;
}

export const NotificationRow: FC<NotificationRowProps> = ({
  notification,
  isAnimated = false,
  isSelected = false,
}: NotificationRowProps) => {
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

  const avatarAppearanceStyle: AppearanceType = isCompassScorecardNotification(
    notification,
  )
    ? 'square'
    : 'circle';

  const avatarGroup = notification.notificationGroup.additionalActors.map(
    (actor) => ({
      key: actor.displayName,
      name: actor.displayName,
      href: '#',
      src: actor.avatarURL,
    }),
  );

  const displayGroupSize = notification.notificationGroup.size - 1;
  const displayUpdateVerbiage = displayGroupSize > 1 ? 'updates' : 'update';
  const notificationBodyText = formatNotificationBodyText(notification);
  const notificationFooterText = formatNotificationFooterText(notification);

  return (
    <div
      className={cn(
        'border-b border-atlassify-notifications hover:bg-atlassify-notifications',
        isSelected && 'ring-2 ring-blue-500',
        (isAnimated || animateExit) &&
          'translate-x-full opacity-0 transition duration-350 ease-in-out',
      )}
      id={notification.id}
    >
      <Box padding="space.100">
        <Inline alignBlock="center" space={spaceBetweenSections}>
          <Inline alignBlock="start" grow="fill" space={spaceBetweenSections}>
            <Box as="div" id="notification-avatar">
              <Stack alignInline="center" space="space.050">
                <Tooltip
                  content={notification.actor.displayName}
                  position="right"
                >
                  <Avatar
                    appearance={avatarAppearanceStyle}
                    name={notification.actor.displayName}
                    size="medium"
                    src={notification.actor.avatarURL}
                  />
                </Tooltip>
                <Tooltip content={categoryDetails.description} position="right">
                  <CategoryIcon label={categoryDetails.description} />
                </Tooltip>
              </Stack>
            </Box>

            <Inline grow="fill">
              <Box
                as="div"
                id="notification-details"
                onClick={handleNotificationInteraction}
                testId="notification-details"
              >
                <div className="cursor-pointer">
                  <Stack space="space.025">
                    <Box as="div" id="notification-title">
                      <Text>{notification.message}</Text>
                      &nbsp;&nbsp;
                      <Text align="end" as="em" size="small">
                        {updatedAt}
                      </Text>
                    </Box>

                    <Box as="div" id="notification-metadata">
                      <Stack space="space.025">
                        <Box
                          as="div"
                          hidden={!notificationBodyText}
                          id="notification-entity"
                          paddingInlineStart={
                            notification.entity.iconUrl
                              ? 'space.0'
                              : 'space.025'
                          }
                        >
                          <Inline
                            alignBlock={blockAlignmentByLength(
                              notificationBodyText,
                            )}
                            space={
                              notification.entity.iconUrl
                                ? 'space.050'
                                : 'space.075'
                            }
                          >
                            {notification.entity.iconUrl ? (
                              <Avatar
                                appearance="square"
                                name={notificationBodyText}
                                size="xsmall"
                                src={notification.entity.iconUrl}
                              />
                            ) : (
                              <notification.product.logo
                                appearance="brand"
                                shouldUseNewLogoDesign
                                size="xxsmall"
                              />
                            )}
                            <Text size="small">{notificationBodyText}</Text>
                          </Inline>
                        </Box>

                        <Box
                          as="div"
                          id="notification-product"
                          paddingInlineStart="space.025"
                        >
                          <Inline
                            alignBlock={blockAlignmentByLength(
                              notificationFooterText,
                            )}
                            space="space.075"
                          >
                            <notification.product.logo
                              appearance="brand"
                              shouldUseNewLogoDesign
                              size="xxsmall"
                            />
                            <Text size="small">{notificationFooterText}</Text>
                          </Inline>
                        </Box>

                        <Box as="div" id="notification-group">
                          {notification.notificationGroup.size > 1 && (
                            <Inline alignBlock="center" space="space.050">
                              {notification.notificationGroup.additionalActors
                                .length > 0 && (
                                // @ts-expect-error We're forcing the xsmall size for Avatar Groups
                                <AvatarGroup data={avatarGroup} size="xsmall" />
                              )}
                              <Text size="small">
                                +{displayGroupSize}{' '}
                                {notification.notificationGroup.additionalActors
                                  .length > 0
                                  ? `${displayUpdateVerbiage} from ${notification.notificationGroup.additionalActors[0].displayName}`
                                  : `other ${displayUpdateVerbiage}`}
                                {notification.notificationGroup.additionalActors
                                  .length > 1 && ' and others'}
                              </Text>
                            </Inline>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </div>
              </Box>
            </Inline>
          </Inline>

          <Box as="div" id="notification-actions">
            {!animateExit &&
              (isNotificationUnread ? (
                <Tooltip
                  content={t('notifications.interactions.mark_as_read')}
                  position="left"
                >
                  <IconButton
                    appearance="subtle"
                    icon={() => (
                      <StrokeWeightLargeIcon
                        color={token('color.icon.brand')}
                        label=""
                      />
                    )}
                    label={t('notifications.interactions.mark_as_read')}
                    onClick={() => {
                      setAnimateExit(
                        settings.fetchOnlyUnreadNotifications &&
                          !settings.delayNotificationState,
                      );
                      markNotificationsRead([notification]);
                    }}
                    shape="circle"
                    spacing="compact"
                    testId="notification-mark-as-read"
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  content={t('notifications.interactions.mark_as_unread')}
                  position="left"
                >
                  <IconButton
                    appearance="subtle"
                    icon={() => null}
                    label={t('notifications.interactions.mark_as_unread')}
                    onClick={() => {
                      markNotificationsUnread([notification]);
                    }}
                    shape="circle"
                    spacing="compact"
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
