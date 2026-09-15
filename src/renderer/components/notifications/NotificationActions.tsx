import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from '@atlaskit/button/new';
import WarningIcon from '@atlaskit/icon/core/status-warning';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import type { NotificationActionFailure } from '../../stores';

const MarkAsReadIcon = () => (
  <StrokeWeightLargeIcon color={token('color.icon.brand')} label="" />
);

const FailedActionIcon = () => (
  <WarningIcon color={token('color.icon.danger')} label="" />
);

const EmptyIcon = () => null;

export interface NotificationActionsProps {
  isUnread: boolean;
  isAnimatingExit: boolean;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
  failure?: NotificationActionFailure;
}

export const NotificationActions: FC<NotificationActionsProps> = ({
  isUnread,
  isAnimatingExit,
  onMarkAsRead,
  onMarkAsUnread,
  failure,
}: NotificationActionsProps) => {
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
                : t('notifications.interactions.mark_as_read')
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
                  ? `${failureMessage}. ${t('notifications.interactions.mark_as_read')}`
                  : t('notifications.interactions.mark_as_read')
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
                : t('notifications.interactions.mark_as_unread')
            }
            position="left"
          >
            <IconButton
              appearance="subtle"
              icon={failure?.action === 'unread' ? FailedActionIcon : EmptyIcon}
              label={
                failure?.action === 'unread'
                  ? `${failureMessage}. ${t('notifications.interactions.mark_as_unread')}`
                  : t('notifications.interactions.mark_as_unread')
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
};
