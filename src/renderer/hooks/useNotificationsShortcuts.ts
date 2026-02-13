import { useCallback, useEffect, useMemo, useState } from 'react';

import { keybindings } from '../constants/keybindings';

import type { AccountNotifications, AtlassifyNotification } from '../types';

import { getNormalizedKey, shouldIgnoreKeyboardEvent } from '../utils/keyboard';
import { openNotification } from '../utils/links';
import { shouldRemoveNotificationsFromState } from '../utils/notifications/remove';

interface UseNotificationsShortcutsOptions {
  notifications: AccountNotifications[];
  markAsReadOnOpen: boolean;
  markNotificationsRead: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
  markNotificationsUnread: (
    notifications: AtlassifyNotification[],
  ) => Promise<void>;
}

interface UseNotificationsShortcutsResult {
  focusedNotificationId: string | null;
  focusNotification: (notificationId: string | null) => void;
}

export const useNotificationsShortcuts = (
  options: UseNotificationsShortcutsOptions,
): UseNotificationsShortcutsResult => {
  const {
    notifications,
    markAsReadOnOpen,
    markNotificationsRead,
    markNotificationsUnread,
  } = options;

  const [focusedNotificationId, setFocusedNotificationId] = useState<
    string | null
  >(null);

  const notificationsById = useMemo(() => {
    const map = new Map<string, AtlassifyNotification>();

    notifications.forEach((accountNotifications) => {
      accountNotifications.notifications.forEach((notification) => {
        map.set(notification.id, notification);
      });
    });

    return map;
  }, [notifications]);

  const getVisibleNotificationIds = useCallback(() => {
    if (typeof document === 'undefined') {
      return [] as string[];
    }

    return Array.from(
      document.querySelectorAll<HTMLElement>('[data-notification-row="true"]'),
    )
      .map((element) => element.dataset.notificationId)
      .filter((id): id is string => Boolean(id));
  }, []);

  const focusNotification = useCallback((notificationId: string | null) => {
    setFocusedNotificationId(notificationId);

    if (!notificationId) {
      return;
    }

    requestAnimationFrame(() => {
      const element = document.querySelector<HTMLElement>(
        `[data-notification-id="${notificationId}"]`,
      );

      element?.scrollIntoView({ block: 'nearest' });
    });
  }, []);

  const moveFocus = useCallback(
    (direction: 'next' | 'previous' | 'first' | 'last') => {
      const visibleIds = getVisibleNotificationIds();

      if (visibleIds.length === 0) {
        focusNotification(null);
        return;
      }

      if (direction === 'first') {
        focusNotification(visibleIds[0]);
        return;
      }

      if (direction === 'last') {
        focusNotification(visibleIds.at(-1) ?? null);
        return;
      }

      const currentIndex = focusedNotificationId
        ? visibleIds.indexOf(focusedNotificationId)
        : -1;

      if (direction === 'next') {
        const nextIndex =
          currentIndex < 0
            ? 0
            : Math.min(currentIndex + 1, visibleIds.length - 1);
        focusNotification(visibleIds[nextIndex]);
        return;
      }

      const previousIndex =
        currentIndex < 0
          ? visibleIds.length - 1
          : Math.max(currentIndex - 1, 0);

      focusNotification(visibleIds[previousIndex]);
    },
    [focusNotification, focusedNotificationId, getVisibleNotificationIds],
  );

  const openFocusedNotification = useCallback(() => {
    if (!focusedNotificationId) {
      return;
    }

    const notification = notificationsById.get(focusedNotificationId);
    if (!notification) {
      return;
    }

    if (markAsReadOnOpen) {
      markNotificationsRead([notification]);
    }

    openNotification(notification);
  }, [
    focusedNotificationId,
    markAsReadOnOpen,
    markNotificationsRead,
    notificationsById,
  ]);

  const toggleFocusedReadState = useCallback(() => {
    if (!focusedNotificationId) {
      return;
    }

    const notification = notificationsById.get(focusedNotificationId);
    if (!notification) {
      return;
    }

    const shouldRemoveOnRead =
      notification.readState === 'unread' &&
      shouldRemoveNotificationsFromState();

    if (shouldRemoveOnRead) {
      const visibleIds = getVisibleNotificationIds();
      const currentIndex = visibleIds.indexOf(focusedNotificationId);
      const nextId =
        currentIndex >= 0 ? (visibleIds[currentIndex + 1] ?? null) : null;

      const waitForRemoval = () => {
        const currentElement = document.querySelector(
          `[data-notification-id="${focusedNotificationId}"]`,
        );

        if (currentElement) {
          requestAnimationFrame(waitForRemoval);
          return;
        }

        if (nextId) {
          focusNotification(nextId);
        } else {
          focusNotification(null);
        }
      };

      requestAnimationFrame(waitForRemoval);
    }

    if (notification.readState === 'read') {
      markNotificationsUnread([notification]);
      return;
    }

    markNotificationsRead([notification]);
  }, [
    focusedNotificationId,
    focusNotification,
    getVisibleNotificationIds,
    markNotificationsRead,
    markNotificationsUnread,
    notificationsById,
  ]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (shouldIgnoreKeyboardEvent(event)) {
        return;
      }

      const key = event.key;

      if (key === keybindings.notifications.navigate.eventKeys[1]) {
        event.preventDefault();
        moveFocus(event.shiftKey ? 'last' : 'next');
        return;
      }

      if (key === keybindings.notifications.navigate.eventKeys[0]) {
        event.preventDefault();
        moveFocus(event.shiftKey ? 'first' : 'previous');
        return;
      }

      if (key === keybindings.notifications.action.eventKey) {
        event.preventDefault();
        openFocusedNotification();
        return;
      }

      const lowerKey = getNormalizedKey(event);
      const toggleReadKey =
        keybindings.notifications.toggleRead.eventKey.toLowerCase();

      if (lowerKey === toggleReadKey) {
        event.preventDefault();
        toggleFocusedReadState();
      }
    };

    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [moveFocus, openFocusedNotification, toggleFocusedReadState]);

  return { focusedNotificationId, focusNotification };
};
