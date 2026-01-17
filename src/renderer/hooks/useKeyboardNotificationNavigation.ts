import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook to manage keyboard navigation within the notifications inbox.
 * Supports up/down arrow keys to navigate through notifications.
 */
export const useKeyboardNotificationNavigation = () => {
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);
  const notificationIdsRef = useRef<string[]>([]);

  /**
   * Register notification IDs in render order
   */
  const registerNotificationIds = useCallback((ids: string[]) => {
    notificationIdsRef.current = ids;
  }, []);

  /**
   * Navigate to the previous notification
   */
  const navigatePrevious = useCallback(() => {
    const ids = notificationIdsRef.current;
    if (ids.length === 0) {
      return;
    }

    if (selectedNotificationId === null) {
      // Start from the last notification
      setSelectedNotificationId(ids[ids.length - 1]);
    } else {
      const currentIndex = ids.indexOf(selectedNotificationId);
      if (currentIndex > 0) {
        setSelectedNotificationId(ids[currentIndex - 1]);
      }
    }
  }, [selectedNotificationId]);

  /**
   * Navigate to the next notification
   */
  const navigateNext = useCallback(() => {
    const ids = notificationIdsRef.current;
    if (ids.length === 0) {
      return;
    }

    if (selectedNotificationId === null) {
      // Start from the first notification
      setSelectedNotificationId(ids[0]);
    } else {
      const currentIndex = ids.indexOf(selectedNotificationId);
      if (currentIndex < ids.length - 1) {
        setSelectedNotificationId(ids[currentIndex + 1]);
      }
    }
  }, [selectedNotificationId]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedNotificationId(null);
  }, []);

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        navigatePrevious();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        navigateNext();
      } else if (event.key === 'Escape') {
        clearSelection();
      }
    },
    [navigatePrevious, navigateNext, clearSelection],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Scroll selected notification into view
  useEffect(() => {
    if (selectedNotificationId) {
      const element = document.getElementById(selectedNotificationId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedNotificationId]);

  return {
    selectedNotificationId,
    registerNotificationIds,
    navigatePrevious,
    navigateNext,
    clearSelection,
  };
};
