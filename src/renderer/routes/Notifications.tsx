import { type FC, useContext, useEffect, useMemo } from 'react';

import { AppContext } from '../context/App';
import { useKeyboardNotificationNavigation } from '../hooks/useKeyboardNotificationNavigation';

import { AllRead } from '../components/AllRead';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { AccountNotifications } from '../components/notifications/AccountNotifications';
import { Oops } from '../components/Oops';

import { Errors } from '../utils/errors';
import { groupNotificationsByProduct } from '../utils/notifications/group';

export const NotificationsRoute: FC = () => {
  const { notifications, status, globalError, hasNotifications, settings } =
    useContext(AppContext);

  const { selectedNotificationId, registerNotificationIds } =
    useKeyboardNotificationNavigation();

  const hasNoAccountErrors = useMemo(
    () => notifications.every((account) => account.error === null),
    [notifications],
  );

  // Register all notification IDs in render order
  useEffect(() => {
    const notificationIds: string[] = [];

    notifications.forEach((accountNotifications) => {
      if (settings.groupNotificationsByProduct) {
        // For grouped by product view, collect in order
        const map = groupNotificationsByProduct(
          accountNotifications.notifications,
        );
        const entries = Array.from(map.entries());

        if (settings.groupNotificationsByProductAlphabetically) {
          entries.sort((a, b) => a[0].localeCompare(b[0]));
        }

        entries.forEach(([, prods]) => {
          prods.forEach((notif) => {
            notificationIds.push(notif.id);
          });
        });
      } else {
        // For flat view, collect sorted by order
        const sorted = [...accountNotifications.notifications].sort(
          (a, b) => a.order - b.order,
        );
        sorted.forEach((notif) => {
          notificationIds.push(notif.id);
        });
      }
    });

    registerNotificationIds(notificationIds);
  }, [notifications, settings, registerNotificationIds]);

  if (status === 'error') {
    return <Oops error={globalError ?? Errors.UNKNOWN} />;
  }

  if (!hasNotifications && hasNoAccountErrors) {
    return <AllRead />;
  }

  return (
    <Page testId="notifications">
      <Contents>
        {notifications.map((accountNotifications) => (
          <AccountNotifications
            account={accountNotifications.account}
            error={accountNotifications.error}
            hasMoreNotifications={accountNotifications.hasMoreNotifications}
            key={accountNotifications.account.id}
            notifications={accountNotifications.notifications}
            selectedNotificationId={selectedNotificationId}
          />
        ))}
      </Contents>
    </Page>
  );
};
