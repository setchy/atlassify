import { useEffect } from 'react';

import { onlineManager } from '@tanstack/react-query';

import { useRuntimeStore } from '../stores';

/**
 * Subscribes to TanStack Query's onlineManager and keeps useRuntimeStore.isOnline in sync.
 *
 * Initial state is synchronized before query client construction.
 */
export function useOnlineSync(): void {
  useEffect(() => {
    const syncOnlineState = () => {
      useRuntimeStore.getState().updateIsOnline(onlineManager.isOnline());
    };
    const unsubscribe = onlineManager.subscribe(syncOnlineState);
    syncOnlineState();

    /**
     * Re-sync online state on system wake.
     * The browser's online/offline events may not have fired yet when powerMonitor
     * triggers the wake event, so we force-sync from navigator.onLine immediately.
     */
    const unsubscribeWake = window.atlassify.onSystemWake(() => {
      onlineManager.setOnline(navigator.onLine);
    });

    return () => {
      unsubscribe();
      unsubscribeWake();
    };
  }, []);
}
