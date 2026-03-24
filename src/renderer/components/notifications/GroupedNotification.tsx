import { type FC, useState } from 'react';

import { Stack } from '@atlaskit/primitives';

import { useAppContext } from '../../hooks/useAppContext';

import type { AtlassifyNotification } from '../../types';
import type { GroupingConfig } from '../../utils/notifications/grouping/types';

import { shouldRemoveNotificationsFromState } from '../../utils/notifications/postProcess';
import { openExternalLink } from '../../utils/system/comms';
import { NotificationGroupHeader } from './NotificationGroupHeader';
import { NotificationRow } from './NotificationRow';

export interface GroupedNotificationProps<T extends string> {
  groupKey: T;
  groupNotifications: AtlassifyNotification[];
  groupingConfig: GroupingConfig<T>;
}

export const GroupedNotification: FC<GroupedNotificationProps<string>> = ({
  groupKey,
  groupNotifications,
  groupingConfig,
}) => {
  const { markNotificationsRead } = useAppContext();

  const [shouldAnimateExit, setShouldAnimateExit] = useState(false);
  const [pendingMarkAsRead, setPendingMarkAsRead] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const shouldAnimateProductExit = shouldRemoveNotificationsFromState();
  const filterDetails = groupingConfig.getDetails(groupKey);

  const actionMarkAsRead = () => {
    if (shouldAnimateProductExit) {
      setShouldAnimateExit(true);
      setPendingMarkAsRead(true);
    } else {
      markNotificationsRead(groupNotifications);
    }
  };

  const handleTransitionEnd = () => {
    if (pendingMarkAsRead) {
      setPendingMarkAsRead(false);
      markNotificationsRead(groupNotifications);
    }
  };

  const actionToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleOpenHome = () => {
    if (filterDetails.home) {
      openExternalLink(filterDetails.home);
    }
  };

  return (
    <Stack>
      <NotificationGroupHeader
        count={groupNotifications.length}
        filterDetails={filterDetails}
        isVisible={isVisible}
        name={filterDetails.name}
        onMarkAllRead={actionMarkAsRead}
        onOpenHome={filterDetails.home ? handleOpenHome : undefined}
        onToggle={actionToggle}
      />

      {isVisible && (
        <div
          className={shouldAnimateExit ? 'notification-exit' : ''}
          data-testid="grouped-notifications-wrapper"
          onTransitionEnd={handleTransitionEnd}
        >
          {groupNotifications.map((notification) => (
            <NotificationRow
              isProductAnimatingExit={shouldAnimateExit}
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </Stack>
  );
};
