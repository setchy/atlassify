import { type FC, useContext, useMemo } from 'react';

import { AllRead } from '../components/AllRead';
import { Oops } from '../components/Oops';
import { AccountNotifications } from '../components/notifications/AccountNotifications';
import { Page } from '../components/primitives/Page';
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
      {notifications.map((accountNotifications) => (
        <AccountNotifications
          key={accountNotifications.account.id}
          account={accountNotifications.account}
          notifications={accountNotifications.notifications}
          error={accountNotifications.error}
        />
      ))}
    </Page>
  );
};
