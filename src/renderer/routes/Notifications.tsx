import { type FC, useMemo, useRef } from 'react';

import { useAppContext } from '../hooks/useAppContext';

import { AllRead } from '../components/AllRead';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { AccountNotifications } from '../components/notifications/AccountNotifications';
import { Oops } from '../components/Oops';

import { Errors } from '../utils/errors';

export const NotificationsRoute: FC = () => {
  const { notifications, status, globalError, hasNotifications } =
    useAppContext();

  // Store previous successful state
  const prevStateRef = useRef({
    notifications,
    status,
    globalError,
    hasNotifications,
  });

  if (status !== 'loading') {
    // Update ref only if not loading
    prevStateRef.current = {
      notifications,
      status,
      globalError,
      hasNotifications,
    };
  }

  // Use previous state if loading
  const displayState =
    status === 'loading'
      ? prevStateRef.current
      : {
          notifications,
          status,
          globalError,
          hasNotifications,
        };

  const hasNoAccountErrors = useMemo(
    () => displayState.notifications.every((account) => account.error === null),
    [displayState.notifications],
  );

  if (displayState.status === 'error') {
    return <Oops error={displayState.globalError ?? Errors.UNKNOWN} />;
  }

  if (!displayState.hasNotifications && hasNoAccountErrors) {
    return <AllRead />;
  }

  return (
    <Page testId="notifications">
      <Contents>
        {displayState.notifications.map((accountNotifications) => (
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
