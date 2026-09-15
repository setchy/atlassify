import { create } from 'zustand';

import type { Account } from '../types';
import type { NotificationActionFailuresStore } from './types';

export function getNotificationFailureKey(
  account: Account,
  notificationId: string,
): string {
  return `${account.id}:${notificationId}`;
}

const useNotificationActionFailuresStore =
  create<NotificationActionFailuresStore>((set, get) => ({
    failures: {},

    setFailure: (notificationKey, failure) => {
      set((state) => ({
        failures: { ...state.failures, [notificationKey]: failure },
      }));
    },

    clearFailure: (notificationKey) => {
      get().clearFailures([notificationKey]);
    },

    clearFailures: (notificationKeys) => {
      const keysToClear = new Set(notificationKeys);
      const remainingFailures = Object.fromEntries(
        Object.entries(get().failures).filter(
          ([notificationKey]) => !keysToClear.has(notificationKey),
        ),
      );
      set({ failures: remainingFailures });
    },

    clearAccountFailures: (accountId) => {
      const accountPrefix = `${accountId}:`;
      const remainingFailures = Object.fromEntries(
        Object.entries(get().failures).filter(
          ([notificationKey]) => !notificationKey.startsWith(accountPrefix),
        ),
      );
      set({ failures: remainingFailures });
    },

    pruneFailures: (notificationKeys) => {
      const keysToKeep = new Set(notificationKeys);
      const remainingFailures = Object.fromEntries(
        Object.entries(get().failures).filter(([notificationKey]) =>
          keysToKeep.has(notificationKey),
        ),
      );
      set({ failures: remainingFailures });
    },

    reset: () => {
      set({ failures: {} });
    },
  }));

export default useNotificationActionFailuresStore;
