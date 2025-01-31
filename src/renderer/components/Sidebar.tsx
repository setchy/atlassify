import { type FC, Fragment, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import FilterIcon from '@atlaskit/icon/core/filter';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';
import NotificationIcon from '@atlaskit/icon/core/notification';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import SettingsIcon from '@atlaskit/icon/core/settings';
import { Box, Stack } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';
import Toggle from '@atlaskit/toggle';
import { token, useThemeObserver } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { APPLICATION } from '../../shared/constants';
import { AppContext } from '../context/App';
import { quitApp } from '../utils/comms';
import { openMyNotifications } from '../utils/links';
import { hasAnyFiltersSet } from '../utils/notifications/filters/filter';
import { getNotificationCount } from '../utils/notifications/notifications';
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

  const hasFilters = hasAnyFiltersSet(settings);

  const theme = useThemeObserver();
  const sidebarIconColorToken =
    theme.colorMode === 'light'
      ? token('color.text.inverse')
      : token('color.text.accent.gray.bolder');

  return (
    <div className="fixed flex flex-col left-sidebar -ml-sidebar w-sidebar h-full overflow-y-auto bg-atlassify-sidebar">
      <div className="flex flex-1 flex-col items-center">
        <Box paddingBlockStart="space.200">
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
                    color={sidebarIconColorToken}
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
                      <ListBulletedIcon
                        label="groupByProduct"
                        color={sidebarIconColorToken}
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
                        color={sidebarIconColorToken}
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
                        color={sidebarIconColorToken}
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
                      color={sidebarIconColorToken}
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
                    color={sidebarIconColorToken}
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
      </Box>
    </div>
  );
};
