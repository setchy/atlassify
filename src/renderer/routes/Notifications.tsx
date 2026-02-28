import { type FC, useEffect, useMemo, useState } from 'react';

import { onlineManager } from '@tanstack/react-query';

import { useAppContext } from '../hooks/useAppContext';
import { useAccountsStore, useSettingsStore } from '../stores';

import { AllRead } from '../components/AllRead';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { AccountNotifications } from '../components/notifications/AccountNotifications';
import { Oops } from '../components/Oops';

import { Errors } from '../utils/errors';

export const NotificationsRoute: FC = () => {
  const { notifications, status, globalError, hasNotifications } =
    useAppContext();

  const [isOnline, setIsOnline] = useState(() => onlineManager.isOnline());

  useEffect(() => {
    const handle = () => setIsOnline(onlineManager.isOnline());
    const unsubscribe = onlineManager.subscribe(handle);
    handle();
    return () => unsubscribe();
  }, []);

  const hasNoAccountErrors = useMemo(
    () => notifications.every((account) => account.error === null),
    [notifications],
  );

  const showAccountHeader = useSettingsStore((s) => s.showAccountHeader);
  const hasMultipleAccounts = useAccountsStore((s) => s.hasMultipleAccounts());

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
