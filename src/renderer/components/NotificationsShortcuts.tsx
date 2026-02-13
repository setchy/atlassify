import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';

import { useNotificationsShortcuts } from '../hooks/useNotificationsShortcuts';

import type { AccountNotifications, AtlassifyNotification } from '../types';

interface NotificationsShortcutsRenderProps {
  focusedNotificationId: string | null;
  focusNotification: (notificationId: string | null) => void;
}

interface NotificationsShortcutsProps {
  notifications: AccountNotifications[];
  markAsReadOnOpen: boolean;
  markNotificationsRead: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  children: (props: NotificationsShortcutsRenderProps) => ReactNode;
}

export const NotificationsShortcuts: FC<NotificationsShortcutsProps> = (
  props: NotificationsShortcutsProps,
) => {
  const {
    notifications,
    markAsReadOnOpen,
    markNotificationsRead,
    markNotificationsUnread,
    children,
  } = props;

  const { focusedNotificationId, focusNotification } =
    useNotificationsShortcuts({
      notifications,
      markAsReadOnOpen,
      markNotificationsRead,
      markNotificationsUnread,
    });

  useEffect(() => {
    const handleBlur = () => {
      focusNotification(null);
    };

    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, [focusNotification]);

  return <>{children({ focusedNotificationId, focusNotification })}</>;
};
