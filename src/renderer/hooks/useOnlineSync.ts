import { useEffect } from 'react';

import { onlineManager } from '@tanstack/react-query';

import { useRuntimeStore } from '../stores';

/**
 * Subscribes to TanStack Query's onlineManager and keeps useRuntimeStore.isOnline in sync.
 *
 * Also corrects the onlineManager's initial state, which defaults to `true` regardless
 * of actual network state. It only self-corrects on the first browser online/offline event,
 * so we force-sync it from navigator.onLine on mount.
 */
export function useOnlineSync(): void {
  useEffect(() => {
    const syncOnlineState = () => {
      useRuntimeStore.getState().updateIsOnline(onlineManager.isOnline());
    };
    const unsubscribe = onlineManager.subscribe(syncOnlineState);

    onlineManager.setOnline(navigator.onLine);

    return () => unsubscribe();
  }, []);
}
