import log from 'electron-log';
import type {
  Account,
  AccountNotifications,
  AtlasifyNotification,
  AtlasifyState,
  SettingsState,
} from '../types';
import { listNotificationsForAuthenticatedUser } from './api/client';
import { determineFailureType } from './api/errors';
import type { AtlassianNotification } from './api/types';
import { getAccountUUID } from './auth/utils';
import { hideWindow, showWindow, updateTrayIcon } from './comms';
import { openNotification } from './links';
import { isWindows } from './platform';
import { getAtlassianProduct } from './product';

export function setTrayIconColor(notifications: AccountNotifications[]) {
  const allNotificationsCount = getNotificationCount(notifications);

  updateTrayIcon(allNotificationsCount);
}

export function getNotificationCount(notifications: AccountNotifications[]) {
  return notifications.reduce(
    (memo, acc) => memo + acc.notifications.length,
    0,
  );
}

export const triggerNativeNotifications = (
  previousNotifications: AccountNotifications[],
  newNotifications: AccountNotifications[],
  state: AtlasifyState,
) => {
  const diffNotifications = newNotifications
    .map((accountNotifications) => {
      const accountPreviousNotifications = previousNotifications.find(
        (item) =>
          getAccountUUID(item.account) ===
          getAccountUUID(accountNotifications.account),
      );

      if (!accountPreviousNotifications) {
        return accountNotifications.notifications;
      }

      const accountPreviousNotificationsIds =
        accountPreviousNotifications.notifications.map((item) => item.id);

      const accountNewNotifications = accountNotifications.notifications.filter(
        (item) => {
          return !accountPreviousNotificationsIds.includes(`${item.id}`);
        },
      );

      return accountNewNotifications;
    })
    .reduce((acc, val) => acc.concat(val), []);

  setTrayIconColor(newNotifications);

  // If there are no new notifications just stop there
  if (!diffNotifications.length) {
    return;
  }

  if (state.settings.playSound) {
    raiseSoundNotification();
  }

  if (state.settings.showSystemNotifications) {
    raiseNativeNotification(diffNotifications);
  }
};

export const raiseNativeNotification = (
  notifications: AtlasifyNotification[],
) => {
  let title: string;
  let body: string;

  if (notifications.length === 1) {
    const notification = notifications[0];
    title = `${isWindows() ? '' : 'Atlasify - '}${
      notification.repository.full_name
    }`;
    body = notification.subject.title;
  } else {
    title = 'Atlasify';
    body = `You have ${notifications.length} notifications.`;
  }

  const nativeNotification = new Notification(title, {
    body,
    silent: true,
  });

  nativeNotification.onclick = () => {
    if (notifications.length === 1) {
      hideWindow();
      openNotification(notifications[0]);
    } else {
      showWindow();
    }
  };

  return nativeNotification;
};

export const raiseSoundNotification = () => {
  const audio = new Audio('../../assets/sounds/clearly.mp3');
  audio.volume = 0.2;
  audio.play();
};

function getNotifications(state: AtlasifyState) {
  return state.auth.accounts.map((account) => {
    return {
      account,
      notifications: listNotificationsForAuthenticatedUser(
        account,
        state.settings,
      ),
    };
  });
}

export async function getAllNotifications(
  state: AtlasifyState,
): Promise<AccountNotifications[]> {
  const responses = await Promise.all([...getNotifications(state)]);

  const notifications: AccountNotifications[] = await Promise.all(
    responses
      .filter((response) => !!response)
      .map(async (accountNotifications) => {
        try {
          const res = (await accountNotifications.notifications).data;

          const rawNotifications =
            res.data.notifications.notificationFeed.nodes;

          let notifications = mapAtlassianNotificationsToAtlasifyNotifications(
            accountNotifications.account,
            rawNotifications,
          );

          notifications = filterNotifications(notifications, state.settings);

          return {
            account: accountNotifications.account,
            notifications: notifications,
            error: null,
          };
        } catch (error) {
          log.error(
            'Error occurred while fetching account notifications',
            error,
          );
          return {
            account: accountNotifications.account,
            notifications: [],
            error: determineFailureType(error),
          };
        }
      }),
  );

  return notifications;
}

export function mapAtlassianNotificationsToAtlasifyNotifications(
  account: Account,
  notifications: AtlassianNotification[],
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): any {
  return notifications?.map((notification: AtlassianNotification) => ({
    id: notification.headNotification.notificationId,
    reason: 'review_requested',
    updated_at: notification.headNotification.timestamp,
    url: notification.headNotification.content.url,
    repository: {
      full_name: 'mocked',
      owner: {
        avatar_url: 'www.google.com',
      },
      html_url: 'www.google.com',
    },
    subject: {
      number: '',
      title: notification.headNotification.content.message,
      url: notification.headNotification.content.url,
      type: 'PullRequest',
      state: 'open',
      user: {
        login: notification.headNotification.content.actor.displayName,
        avatar_url: notification.headNotification.content.actor.avatarURL,
        type: 'User',
      },
      comments: 0,
      tasks: 0,
    },
    entity: notification.headNotification.content.entity,
    path: notification.headNotification.content.path[0],
    category: notification.headNotification.category,
    readState: notification.headNotification.readState,
    product: getAtlassianProduct(notification),
    account: account,
  }));
}

export function filterNotifications(
  notifications: AtlasifyNotification[],
  settings: SettingsState,
): AtlasifyNotification[] {
  return notifications.filter((notification) => {
    if (
      settings.filterCategories.length > 0 &&
      !settings.filterCategories.includes(notification.category)
    ) {
      return false;
    }

    if (
      settings.filterReadStates.length > 0 &&
      !settings.filterReadStates.includes(notification.readState)
    ) {
      return false;
    }

    if (
      settings.filterProducts.length > 0 &&
      !settings.filterProducts.includes(notification.product.name)
    ) {
      return false;
    }

    return true;
  });
}
