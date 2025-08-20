import { type FC, useContext, useMemo } from 'react';

import { AllRead } from '../components/AllRead';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { AccountNotifications } from '../components/notifications/AccountNotifications';
import { Oops } from '../components/Oops';
import { AppContext } from '../context/App';
import { Errors } from '../utils/errors';
import { getNotificationCount } from '../utils/notifications/notifications';

export const NotificationsRoute: FC = () => {
  const { notifications, status, globalError } = useContext(AppContext);

  const hasNoAccountErrors = useMemo(
    () => notifications.every((account) => account.error === null),
    [notifications],
  );

  const hasNotifications = useMemo(
    () => getNotificationCount(notifications) > 0,
    [notifications],
  );

  if (status === 'error') {
    return <Oops error={globalError ?? Errors.UNKNOWN} />;
  }

  if (!hasNotifications && hasNoAccountErrors) {
    return <AllRead />;
  }

  return (
    <Page id="notifications">
      <Contents>
        {notifications.map((accountNotifications) => (
          <AccountNotifications
            account={accountNotifications.account}
            error={accountNotifications.error}
            hasMoreNotifications={accountNotifications.hasMoreNotifications}
            key={accountNotifications.account.id}
            notifications={accountNotifications.notifications}
          />
        ))}
      </Contents>
    </Page>
  );
};
