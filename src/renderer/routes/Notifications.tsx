import { type FC, useMemo } from 'react';

import { useAppContext } from '../hooks/useAppContext';
import useAccountsStore from '../stores/useAccountsStore';
import { useSettingsStore } from '../stores/useSettingsStore';

import { AllRead } from '../components/AllRead';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { NotificationsShortcuts } from '../components/NotificationsShortcuts';
import { AccountNotifications } from '../components/notifications/AccountNotifications';
import { Oops } from '../components/Oops';

import { Errors } from '../utils/errors';

export const NotificationsRoute: FC = () => {
  const {
    notifications,
    status,
    globalError,
    hasNotifications,
    markNotificationsRead,
    markNotificationsUnread,
  } = useAppContext();

  const hasNoAccountErrors = useMemo(
    () => notifications.every((account) => account.error === null),
    [notifications],
  );

  const showAccountHeader = useSettingsStore((s) => s.showAccountHeader);
  const markAsReadOnOpen = useSettingsStore((s) => s.markAsReadOnOpen);
  const hasMultipleAccounts = useAccountsStore((s) => s.hasMultipleAccounts());

  if (status === 'error') {
    return <Oops error={globalError ?? Errors.UNKNOWN} />;
  }

  if (!hasNotifications && hasNoAccountErrors) {
    return <AllRead />;
  }

  return (
    <NotificationsShortcuts
      markAsReadOnOpen={markAsReadOnOpen}
      markNotificationsRead={markNotificationsRead}
      markNotificationsUnread={markNotificationsUnread}
      notifications={notifications}
    >
      {({ focusedNotificationId, focusNotification }) => (
        <Page testId="notifications">
          <Contents>
            {notifications.map((accountNotifications) => (
              <AccountNotifications
                account={accountNotifications.account}
                error={accountNotifications.error}
                focusedNotificationId={focusedNotificationId}
                hasMoreNotifications={accountNotifications.hasMoreNotifications}
                key={accountNotifications.account.id}
                notifications={accountNotifications.notifications}
                onNotificationFocus={focusNotification}
                showAccountHeader={hasMultipleAccounts || showAccountHeader}
              />
            ))}
          </Contents>
        </Page>
      )}
    </NotificationsShortcuts>
  );
};
