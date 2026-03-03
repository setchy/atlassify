import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Avatar, { type AppearanceType } from '@atlaskit/avatar';
import AvatarGroup from '@atlaskit/avatar-group';
import { IconButton } from '@atlaskit/button/new';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { useAppContext } from '../../hooks/useAppContext';
import { useSettingsStore } from '../../stores';

import type { AtlassifyNotification } from '../../types';

import {
  categoryFilter,
  readStateFilter,
} from '../../utils/notifications/filters';
import {
  formatNotificationBodyText,
  formatNotificationFooterText,
  formatNotificationUpdatedAt,
  isCompassScorecardNotification,
} from '../../utils/notifications/formatters';
import { shouldRemoveNotificationsFromState } from '../../utils/notifications/postProcess';
import { openNotification } from '../../utils/system/links';
import { cn } from '../../utils/ui/cn';
import { blockAlignmentByLength } from '../../utils/ui/display';

export interface NotificationRowProps {
  notification: AtlassifyNotification;
  isProductAnimatingExit: boolean;
}

export const NotificationRow: FC<NotificationRowProps> = ({
  notification,
  isProductAnimatingExit,
}: NotificationRowProps) => {
  const { t } = useTranslation();

  const markAsReadOnOpen = useSettingsStore((s) => s.markAsReadOnOpen);

  const {
    markNotificationsRead,
    markNotificationsUnread,
    markAsMutation,
    focusedNotificationId,
  } = useAppContext();

  const [shouldAnimateNotificationExit, setShouldAnimateNotificationExit] =
    useState(false);

  const isFocused = focusedNotificationId === notification.id;

  const shouldAnimateExit = shouldRemoveNotificationsFromState();

  // Optimistic update error recovery:
  // Animation is triggered immediately on user action for seamless UX.
  // If the mutation fails, this effect resets the animation to restore the original state.
  useEffect(() => {
    // On error: reset animation for this notification if it was part of the failed mutation
    if (
      markAsMutation?.isError &&
      markAsMutation?.variables?.action === 'read'
    ) {
      const mutatedNotificationIds =
        markAsMutation.variables.targetNotifications.map((n) => n.id);

      if (mutatedNotificationIds.includes(notification.id)) {
        setShouldAnimateNotificationExit(false);
      }
    }
  }, [markAsMutation?.isError, markAsMutation?.variables, notification.id]);

  const actionNotificationInteraction = () => {
    if (markAsReadOnOpen) {
      // Optimistically trigger animation immediately
      setShouldAnimateNotificationExit(shouldAnimateExit);
      markNotificationsRead([notification]);
    }

    openNotification(notification);
  };

  const actionMarkAsRead = () => {
    // Optimistically trigger animation immediately
    setShouldAnimateNotificationExit(shouldAnimateExit);
    markNotificationsRead([notification]);
  };

  const actionMarkAsUnread = () => {
    markNotificationsUnread([notification]);
  };

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
  const focusedStyles = isFocused
    ? {
        backgroundColor: token('color.background.selected'),
        boxShadow: `inset 0 0 0 2px ${token('color.border.focused')}`,
      }
    : undefined;

  return (
    <div
      className={cn(
        'border-b border-atlassify-notifications hover:bg-atlassify-notifications',
        isFocused && 'bg-atlassify-notifications',
        (isProductAnimatingExit || shouldAnimateNotificationExit) &&
          'translate-x-full opacity-0 transition duration-350 ease-in-out',
      )}
      data-notification-id={notification.id}
      data-notification-row="true"
      id={notification.id}
      style={focusedStyles}
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
                onClick={actionNotificationInteraction}
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
            {!shouldAnimateNotificationExit &&
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
                    isDisabled={markAsMutation?.isPending}
                    label={t('notifications.interactions.mark_as_read')}
                    onClick={actionMarkAsRead}
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
                    isDisabled={markAsMutation?.isPending}
                    label={t('notifications.interactions.mark_as_unread')}
                    onClick={actionMarkAsUnread}
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
