import {
	type Account,
	type AppearanceSettingsState,
	type AtlassifyState,
	type AuthState,
	type EncryptedToken,
	type FilterSettingsState,
	type Link,
	type NotificationSettingsState,
	OpenPreference,
	type SettingsState,
	type SystemSettingsState,
	Theme,
	type Username,
} from "../types";

export const mockAtlassianCloudAccount: Account = {
	id: "123456789",
	username: "user@atlassify.io" as Username,
	token: "token-123-456" as EncryptedToken,
	name: "Atlassify",
	avatar: "https://avatar.atlassify.io" as Link,
};

export const mockAuth: AuthState = {
	accounts: [mockAtlassianCloudAccount],
};

const mockAppearanceSettings: AppearanceSettingsState = {
	theme: Theme.LIGHT,
	zoomPercentage: 100,
	language: "en",
};

const mockNotificationSettings: NotificationSettingsState = {
	markAsReadOnOpen: true,
	delayNotificationState: false,
	fetchOnlyUnreadNotifications: true,
	groupNotificationsByProduct: false,
	groupNotificationsByProductAlphabetically: false,
};

const mockSystemSettings: SystemSettingsState = {
	openLinks: OpenPreference.FOREGROUND,
	keyboardShortcutEnabled: true,
	showNotificationsCountInTray: true,
	showSystemNotifications: true,
	playSoundNewNotifications: true,
	useAlternateIdleIcon: false,
	openAtStartup: true,
};

const mockFilters: FilterSettingsState = {
	filterTimeSensitive: [],
	filterCategories: [],
	filterReadStates: [],
	filterProducts: [],
	filterActors: [],
};

export const mockSettings: SettingsState = {
	...mockAppearanceSettings,
	...mockNotificationSettings,
	...mockSystemSettings,
	...mockFilters,
};

export const mockState: AtlassifyState = {
	auth: mockAuth,
	settings: mockSettings,
};
