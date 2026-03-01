import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { NotificationsStore } from './types';

/**
 * Atlassify Notifications store.
 *
 * Holds tray-relevant notification status derived from filtered query data.
 * Written by the useNotifications hook (inside React) so that tray update
 * functions running outside of React can read pre-filtered values without
 * needing to re-apply filter logic against the raw query cache.
 *
 * Not persisted — values are re-established on each render cycle.
 */
const useNotificationsStore = create<NotificationsStore>()(
  subscribeWithSelector((set) => ({
    notificationCount: 0,
    hasMoreAccountNotifications: false,
    isError: false,
    isOnline: true,

    updateNotificationStatus: (
      notificationCount: number,
      hasMoreAccountNotifications: boolean,
      isError: boolean,
    ) => {
      set({ notificationCount, hasMoreAccountNotifications, isError });
    },

    updateIsOnline: (isOnline: boolean) => {
      set({ isOnline });
    },
  })),
);

export default useNotificationsStore;
