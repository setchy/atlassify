import { type FC, useMemo } from 'react';

import { useAppContext } from '../hooks/useAppContext';
import useAccountsStore from '../stores/useAccountsStore';
import { useSettingsStore } from '../stores/useSettingsStore';

import { AllRead } from '../components/AllRead';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { AccountNotifications } from '../components/notifications/AccountNotifications';
import { Oops } from '../components/Oops';

import { Errors } from '../utils/errors';

export const NotificationsRoute: FC = () => {
  const { notifications, status, globalError, hasNotifications, isOnline } =
    useAppContext();

  const hasNoAccountErrors = useMemo(
    () => notifications.every((account) => account.error === null),
    [notifications],
  );

  const showAccountHeader = useSettingsStore((s) => s.showAccountHeader);
  const hasMultipleAccounts = useAccountsStore((s) => s.hasMultipleAccounts());

  console.log('ADAM HERE WITH ', isOnline);

  if (!isOnline) {
    return <Oops error={Errors.OFFLINE} />;
  }

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
            showAccountHeader={hasMultipleAccounts || showAccountHeader}
          />
        ))}
      </Contents>
    </Page>
  );
};
