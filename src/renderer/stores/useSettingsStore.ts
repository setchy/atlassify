import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Constants } from '../constants';

import type { SettingsState } from './types';

import { defaultSettings } from './defaults';

/**
 * All allowed Settings types.
 * Automatically derived from the SettingsState
 */
type SettingsKey = keyof SettingsState;

type UpdateSettings = <K extends SettingsKey>(key: K, value: SettingsState[K]) => void;

interface SettingsActions {
  updateSetting: UpdateSettings;
  reset: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

/**
 * Atlassify Settings store.
 *
 * Automatically persisted to local storage
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, _get, store) => ({
      ...defaultSettings,

      updateSetting: (key, value) => {
        set(() => ({
          [key]: value,
        }));
      },

      reset: () => {
        set(store.getInitialState());
      },
    }),
    {
      name: Constants.SETTINGS_STORE_KEY,

      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        zoomPercentage: state.zoomPercentage,

        markAsReadOnOpen: state.markAsReadOnOpen,
        delayNotificationState: state.delayNotificationState,
        fetchOnlyUnreadNotifications: state.fetchOnlyUnreadNotifications,
        groupNotificationsByProduct: state.groupNotificationsByProduct,
        groupNotificationsByProductAlphabetically:
          state.groupNotificationsByProductAlphabetically,
        groupNotificationsByTitle: state.groupNotificationsByTitle,

        showNotificationsCountInTray: state.showNotificationsCountInTray,
        useUnreadActiveIcon: state.useUnreadActiveIcon,
        useAlternateIdleIcon: state.useAlternateIdleIcon,

        openLinks: state.openLinks,
        keyboardShortcutEnabled: state.keyboardShortcutEnabled,
        showSystemNotifications: state.showSystemNotifications,
        playSoundNewNotifications: state.playSoundNewNotifications,
        notificationVolume: state.notificationVolume,
        openAtStartup: state.openAtStartup,
      }),
    },
  ),
);

export default useSettingsStore;
