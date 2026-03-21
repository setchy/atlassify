import { type FC, useMemo } from 'react';

import { useAppContext } from '../hooks/useAppContext';
import { useAccountsStore, useSettingsStore } from '../stores';

import { AllRead } from '../components/AllRead';
import { Loading } from '../components/Loading';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { AccountNotifications } from '../components/notifications/AccountNotifications';
import { Oops } from '../components/Oops';

import { Errors } from '../utils/core/errors';

export const NotificationsRoute: FC = () => {
  const {
    notifications,
    globalError,
    hasNotifications,
    isOnline,
    isLoading,
    isErrorOrPaused,
  } = useAppContext();

  const hasNoAccountErrors = useMemo(
    () => notifications.every((account) => account.error === null),
    [notifications],
  );

  const showAccountHeader = useSettingsStore((s) => s.showAccountHeader);
  const hasMultipleAccounts = useAccountsStore((s) => s.hasMultipleAccounts());

  if (!isOnline) {
    return <Oops error={Errors.OFFLINE} />;
  }

  if (isErrorOrPaused) {
    return <Oops error={globalError ?? Errors.UNKNOWN} />;
  }

  if (isLoading) {
    return <Loading />;
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
            groupedNotifications={accountNotifications.groupedNotifications}
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
