import { type FC, useState } from 'react';

import { Box, Inline } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { useAppContext } from '../../hooks/useAppContext';
import { useSettingsStore } from '../../stores';

import type { AtlassifyNotification } from '../../types';

import { readStateFilter } from '../../utils/notifications/filters';
import { shouldRemoveNotificationsFromState } from '../../utils/notifications/postProcess';
import { getProductStrategy } from '../../utils/products';
import { openNotification } from '../../utils/system/links';
import { cn } from '../../utils/ui/cn';
import { NotificationActions } from './NotificationActions';
import { NotificationAvatar } from './NotificationAvatar';
import { NotificationContent } from './NotificationContent';

export interface NotificationRowProps {
  notification: AtlassifyNotification;
  isProductAnimatingExit: boolean;
}

export const NotificationRow: FC<NotificationRowProps> = ({
  notification,
  isProductAnimatingExit,
}: NotificationRowProps) => {
  const markAsReadOnOpen = useSettingsStore((s) => s.markAsReadOnOpen);

  const {
    markNotificationsRead,
    markNotificationsUnread,
    focusedNotificationId,
  } = useAppContext();

  const [shouldAnimateNotificationExit, setShouldAnimateNotificationExit] =
    useState(false);
  const [pendingMarkAsRead, setPendingMarkAsRead] = useState(false);

  const isFocused = focusedNotificationId === notification.id;

  const shouldAnimateExit = shouldRemoveNotificationsFromState();

  const actionNotificationInteraction = () => {
    if (markAsReadOnOpen) {
      if (shouldAnimateExit) {
        setShouldAnimateNotificationExit(true);
        setPendingMarkAsRead(true);
      } else {
        markNotificationsRead([notification]);
      }
    }

    openNotification(notification);
  };

  const actionMarkAsRead = () => {
    if (shouldAnimateExit) {
      setShouldAnimateNotificationExit(true);
      setPendingMarkAsRead(true);
    } else {
      markNotificationsRead([notification]);
    }
  };

  const actionMarkAsUnread = () => {
    markNotificationsUnread([notification]);
  };

  const handleTransitionEnd = () => {
    if (pendingMarkAsRead && !isProductAnimatingExit) {
      setPendingMarkAsRead(false);
      markNotificationsRead([notification]);
    }
  };

  const isNotificationUnread = readStateFilter.filterNotification(
    notification,
    'unread',
  );

  const strategy = getProductStrategy(notification);

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
          'notification-exit',
      )}
      data-notification-id={notification.id}
      data-notification-row="true"
      id={notification.id}
      onTransitionEnd={handleTransitionEnd}
      style={focusedStyles}
    >
      <Box padding="space.100">
        <Inline alignBlock="center" space="space.100">
          <Inline alignBlock="start" grow="fill" space="space.100">
            <Box as="div" id="notification-avatar">
              <NotificationAvatar
                avatarAppearance={strategy.avatarAppearance(notification)}
                notification={notification}
              />
            </Box>

            <Inline grow="fill">
              <NotificationContent
                bodyText={strategy.bodyText(notification)}
                footerText={strategy.footerText(notification)}
                notification={notification}
                onClick={actionNotificationInteraction}
              />
            </Inline>
          </Inline>

          <NotificationActions
            isAnimatingExit={shouldAnimateNotificationExit}
            isUnread={isNotificationUnread}
            onMarkAsRead={actionMarkAsRead}
            onMarkAsUnread={actionMarkAsUnread}
          />
        </Inline>
      </Box>
    </div>
  );
};
