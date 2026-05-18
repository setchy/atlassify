import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { RuntimeStore } from './types';

import { DEFAULT_RUNTIME_STATE } from './defaults';

/**
 * Atlassify Runtime store.
 *
 * Holds derived notification states from filtered query data.
 * Written by the useNotifications hook (inside React) so that tray update
 * functions running outside of React can read pre-filtered values without
 * needing to re-apply filter logic against the raw query cache.
 *
 * Not persisted — values are re-established on each render cycle.
 */
const useRuntimeStore = create<RuntimeStore>()(
  subscribeWithSelector((set) => ({
    ...DEFAULT_RUNTIME_STATE,

    /** Updates the notification count, hasMore flag, and account error flag from the latest fetch result. */
    updateNotificationStatus: (
      notificationCount: number,
      hasMoreAccountNotifications: boolean,
      hasAnyAccountError: boolean,
    ) => {
      set({
        notificationCount,
        hasMoreAccountNotifications,
        hasAnyAccountError,
      });
    },

    /** Updates the online/offline connectivity status. */
    updateIsOnline: (isOnline: boolean) => {
      set({ isOnline });
    },
  })),
);

export default useRuntimeStore;
