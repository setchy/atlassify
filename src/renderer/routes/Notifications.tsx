import { type FC, useMemo, useRef } from 'react';

import { useAppContext } from '../hooks/useAppContext';

import { AllRead } from '../components/AllRead';
import { Contents } from '../components/layout/Contents';
import { Page } from '../components/layout/Page';
import { AccountNotifications } from '../components/notifications/AccountNotifications';
import { Oops } from '../components/Oops';

import {
  selectGlobalError,
  selectHasNotifications,
  useNotificationsStore,
} from '../stores/notifications';
import { Errors } from '../utils/errors';

export const NotificationsRoute: FC = () => {
  const { settings } = useAppContext();
  const allNotifications = useNotificationsStore(
    (state) => state.allNotifications,
  );
  const status = useNotificationsStore((state) => state.fetchStatus);
  const globalError = useNotificationsStore(selectGlobalError);
  const hasNotifications = useNotificationsStore((state) =>
    selectHasNotifications(state, settings),
  );

  // Store previous successful state
  const prevStateRef = useRef({
    allNotifications,
    status,
    globalError,
    hasNotifications,
  });

  if (status !== 'loading') {
    // Update ref only if not loading
    prevStateRef.current = {
      allNotifications,
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
          allNotifications,
          status,
          globalError,
          hasNotifications,
        };

  const hasNoAccountErrors = useMemo(
    () =>
      displayState.allNotifications.every((account) => account.error === null),
    [displayState.allNotifications],
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
        {displayState.allNotifications.map((accountNotifications) => (
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
