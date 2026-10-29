import { useTranslation } from 'react-i18next';

import { IconButton } from '@atlaskit/button/new';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { NotificationActionFailure } from '../../stores';

function MarkAsReadIcon() {
  return <StrokeWeightLargeIcon color={token('color.icon.brand')} label="" />;
}

function FailedActionIcon() {
  return <WarningIcon color={token('color.icon.danger')} label="" />;
}

function EmptyIcon() {
  return null;
}

export interface NotificationActionsProps {
  readonly isUnread: boolean;
  readonly isAnimatingExit: boolean;
  readonly onMarkAsRead: () => void;
  readonly onMarkAsUnread: () => void;
  readonly failure?: NotificationActionFailure;
}

export function NotificationActions({
  isUnread,
  isAnimatingExit,
  onMarkAsRead,
  onMarkAsUnread,
  failure,
}: NotificationActionsProps) {
  const { t } = useTranslation();
  const failureMessage = failure
    ? `${failure.error.title}: ${failure.error.descriptions.join(' ')}`
    : undefined;

  return (
    <Box as="div" id="notification-actions">
      {!isAnimatingExit &&
        (isUnread ? (
          <Tooltip
            content={
              failure?.action === 'read'
                ? failureMessage
                : t('notifications.interactions.mark_as_read', {
                    defaultValue: 'Mark as read',
                  })
            }
            position="left"
          >
            <IconButton
              appearance="subtle"
              icon={
                failure?.action === 'read' ? FailedActionIcon : MarkAsReadIcon
              }
              label={
                failure?.action === 'read'
                  ? `${failureMessage}. ${t('notifications.interactions.mark_as_read', { defaultValue: 'Mark as read' })}`
                  : t('notifications.interactions.mark_as_read', {
                      defaultValue: 'Mark as read',
                    })
              }
              onClick={onMarkAsRead}
              shape="circle"
              spacing="compact"
              testId="notification-mark-as-read"
            />
          </Tooltip>
        ) : (
          <Tooltip
            content={
              failure?.action === 'unread'
                ? failureMessage
                : t('notifications.interactions.mark_as_unread', {
                    defaultValue: 'Mark as unread',
                  })
            }
            position="left"
          >
            <IconButton
              appearance="subtle"
              icon={failure?.action === 'unread' ? FailedActionIcon : EmptyIcon}
              label={
                failure?.action === 'unread'
                  ? `${failureMessage}. ${t('notifications.interactions.mark_as_unread', { defaultValue: 'Mark as unread' })}`
                  : t('notifications.interactions.mark_as_unread', {
                      defaultValue: 'Mark as unread',
                    })
              }
              onClick={onMarkAsUnread}
              shape="circle"
              spacing="compact"
              testId="notification-mark-as-unread"
            />
          </Tooltip>
        ))}
    </Box>
  );
}
