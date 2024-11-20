import { type FC, Fragment, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import FilterIcon from '@atlaskit/icon/core/filter';
import ListIcon from '@atlaskit/icon/core/list-bulleted';
import NotificationIcon from '@atlaskit/icon/core/notification';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import SettingsIcon from '@atlaskit/icon/core/settings';
import { Box, Stack } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';
import Toggle from '@atlaskit/toggle';
import Tooltip from '@atlaskit/tooltip';

import { colors } from '../../../tailwind.config';
import { APPLICATION } from '../../shared/constants';
import { AppContext } from '../context/App';
import { quitApp } from '../utils/comms';
import { hasAnyFiltersSet } from '../utils/filters';
import { openMyNotifications } from '../utils/links';
import { getNotificationCount } from '../utils/notifications/notifications';
import { isLightMode } from '../utils/theme';
import { LogoIcon } from './icons/LogoIcon';

export const Sidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    notifications,
    fetchNotifications,
    isLoggedIn,
    settings,
    updateSetting,
    status,
  } = useContext(AppContext);

  const toggleFilters = () => {
    if (location.pathname.startsWith('/filters')) {
      navigate('/', { replace: true });
    } else {
      navigate('/filters');
    }
  };

  const toggleSettings = () => {
    if (location.pathname.startsWith('/settings')) {
      navigate('/', { replace: true });
      fetchNotifications();
    } else {
      navigate('/settings');
    }
  };

  const refreshNotifications = () => {
    navigate('/', { replace: true });
    fetchNotifications();
  };

  const notificationsCount = useMemo(() => {
    return getNotificationCount(notifications);
  }, [notifications]);

  const notificationsLabel = useMemo(() => {
    const hasMoreNotifications = notifications.some(
      (n) => n.hasMoreNotifications,
    );

    return `${notificationsCount}${hasMoreNotifications ? '+' : ''}`;
  }, [notifications, notificationsCount]);

  const hasFilters = useMemo(() => {
    return hasAnyFiltersSet(settings);
  }, [settings]);

  return (
    <div className="fixed flex flex-col left-12 -ml-12 w-12 h-full overflow-y-auto bg-sidebar-light dark:bg-sidebar-dark">
      <div className="flex flex-1 flex-col items-center">
        <Box paddingBlockStart="space.200">
          {/* <Stack spread="space-between" alignInline="center" alignBlock="stretch"> */}
          <Stack alignInline="center" space="space.100">
            <Tooltip content="Home" position="right">
              <IconButton
                label="Home"
                appearance="subtle"
                icon={() => <LogoIcon width={32} height={32} />}
                shape="circle"
                onClick={() => navigate('/', { replace: true })}
                testId="sidebar-home"
              />
            </Tooltip>

            <Tooltip
              content={`${notificationsLabel} unread notifications`}
              position="right"
            >
              <IconButton
                label="Notifications"
                icon={(iconProps) => (
                  <NotificationIcon
                    {...iconProps}
                    LEGACY_size="small"
                    LEGACY_primaryColor="white"
                  />
                )}
                appearance={notificationsCount > 0 ? 'primary' : 'subtle'}
                spacing="compact"
                shape="circle"
                onClick={() => openMyNotifications()}
                testId="sidebar-notifications"
              />
            </Tooltip>

            {isLoggedIn && (
              <Fragment>
                <Tooltip
                  content="Show only unread notifications"
                  position="right"
                >
                  <Toggle
                    id="toggle-unread-only"
                    size="regular"
                    label="Show only unread toggle"
                    isChecked={settings.fetchOnlyUnreadNotifications}
                    onChange={async (evt) => {
                      updateSetting(
                        'fetchOnlyUnreadNotifications',
                        evt.target.checked,
                      );
                    }}
                    testId="sidebar-toggle-unread-only"
                  />
                </Tooltip>

                <Tooltip
                  content="Group notifications by products"
                  position="right"
                >
                  <IconButton
                    label="Group notifications by products"
                    icon={() => (
                      <ListIcon
                        label="groupByProduct"
                        LEGACY_size="small"
                        LEGACY_primaryColor="white"
                      />
                    )}
                    onClick={() => {
                      updateSetting(
                        'groupNotificationsByProduct',
                        !settings.groupNotificationsByProduct,
                      );
                    }}
                    appearance={
                      settings.groupNotificationsByProduct
                        ? 'discovery'
                        : 'subtle'
                    }
                    spacing="compact"
                    shape="circle"
                    testId="sidebar-group-by-product"
                  />
                </Tooltip>

                <Tooltip content="Filter notifications" position="right">
                  <IconButton
                    label="Filters"
                    icon={(iconProps) => (
                      <FilterIcon
                        {...iconProps}
                        LEGACY_size="small"
                        LEGACY_primaryColor="white"
                      />
                    )}
                    appearance={hasFilters ? 'discovery' : 'subtle'}
                    spacing="compact"
                    shape="circle"
                    onClick={() => toggleFilters()}
                    testId="sidebar-filter-notifications"
                  />
                </Tooltip>
              </Fragment>
            )}
          </Stack>
        </Box>
      </div>
      <Box paddingBlockEnd="space.200">
        <Stack alignInline="center" space="space.150">
          {isLoggedIn ? (
            <Fragment>
              <Tooltip content="Refresh notifications" position="right">
                <IconButton
                  label="Refresh notifications"
                  icon={(iconProps) =>
                    status === 'loading' ? (
                      <Spinner
                        label="Refresh notifications"
                        size="medium"
                        appearance="invert"
                      />
                    ) : (
                      <RefreshIcon
                        {...iconProps}
                        LEGACY_size="medium"
                        LEGACY_primaryColor="white"
                      />
                    )
                  }
                  appearance="subtle"
                  shape="circle"
                  onClick={() => refreshNotifications()}
                  isDisabled={status === 'loading'}
                  testId="sidebar-refresh"
                />
              </Tooltip>

              <Tooltip content="Settings" position="right">
                <IconButton
                  label="Settings"
                  icon={(iconProps) => (
                    <SettingsIcon
                      {...iconProps}
                      LEGACY_size="medium"
                      LEGACY_primaryColor="white"
                    />
                  )}
                  appearance="subtle"
                  shape="circle"
                  onClick={() => toggleSettings()}
                  testId="sidebar-settings"
                />
              </Tooltip>
            </Fragment>
          ) : (
            <Tooltip content={`Quit ${APPLICATION.NAME}`} position="right">
              <IconButton
                label={`Quit ${APPLICATION.NAME}`}
                icon={(iconProps) => (
                  <CrossCircleIcon
                    {...iconProps}
                    LEGACY_size="medium"
                    LEGACY_primaryColor="white"
                    LEGACY_secondaryColor={
                      isLightMode() ? colors.sidebar.light : colors.sidebar.dark
                    }
                  />
                )}
                shape="circle"
                appearance="subtle"
                onClick={() => quitApp()}
                testId="sidebar-quit"
              />
            </Tooltip>
          )}
        </Stack>
        {/* </Stack> */}
      </Box>
    </div>
  );
};
