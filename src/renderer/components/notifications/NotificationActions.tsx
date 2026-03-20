import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from '@atlaskit/button/new';
import StrokeWeightLargeIcon from '@atlaskit/icon/core/stroke-weight-large';
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

export interface NotificationActionsProps {
  isUnread: boolean;
  isAnimatingExit: boolean;
  onMarkAsRead: () => void;
  onMarkAsUnread: () => void;
}

export const NotificationActions: FC<NotificationActionsProps> = ({
  isUnread,
  isAnimatingExit,
  onMarkAsRead,
  onMarkAsUnread,
}: NotificationActionsProps) => {
  const { t } = useTranslation();

  return (
    <Box as="div" id="notification-actions">
      {!isAnimatingExit &&
        (isUnread ? (
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
              onClick={onMarkAsRead}
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
