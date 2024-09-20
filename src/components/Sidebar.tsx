import { type FC, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import ListIcon from '@atlaskit/icon/glyph/list';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import { AtlasIcon } from '@atlaskit/logo';
import { Box, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import Spinner from '@atlaskit/spinner';
import Toggle from '@atlaskit/toggle';
import { AppContext } from '../context/App';
import { quitApp } from '../utils/comms';
import { getFilterCount } from '../utils/filters';
import { openMyNotifications } from '../utils/links';
import { getNotificationCount } from '../utils/notifications/notifications';
import { colors } from '../../tailwind.config';

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
    const hasMore = notifications.some((n) => n.hasNextPage);

    return `${notificationsCount}${hasMore ? '+' : ''}`;
  }, [notifications]);

  const filterCount = useMemo(() => {
    return getFilterCount(settings);
  }, [settings]);

  return (
    <div className="fixed left-14 -ml-14 flex h-full w-14 flex-col overflow-y-auto bg-sidebar">
      <div className="flex flex-1 flex-col items-center py-4">
        <div className="mx-auto my-3">
          <Tooltip content="Home" position="right">
            <IconButton
              label="Home"
              appearance="subtle"
              icon={(iconProps) => (
                <AtlasIcon {...iconProps} size="medium" appearance="inverse" />
              )}
              shape="circle"
              onClick={() => navigate('/', { replace: true })}
              testId="sidebar-home"
            />
          </Tooltip>
        </div>

        <Stack alignInline="center" space="space.100">
          <Tooltip
            content={`${notificationsLabel} unread notifications`}
            position="right"
          >
            <IconButton
              label="Notifications"
              icon={(iconProps) => (
                <NotificationIcon
                  {...iconProps}
                  size="small"
                  primaryColor="white"
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
            <>
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
                      size="small"
                      primaryColor="white"
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

              <Tooltip content="Filters" position="right">
                <IconButton
                  label="Filters"
                  icon={(iconProps) => (
                    <FilterIcon
                      {...iconProps}
                      size="small"
                      primaryColor="white"
                    />
                  )}
                  appearance={filterCount > 0 ? 'discovery' : 'subtle'}
                  spacing="compact"
                  shape="circle"
                  onClick={() => toggleFilters()}
                  testId="sidebar-filters"
                />
              </Tooltip>
            </>
          )}
        </Stack>
      </div>

      <Box paddingBlock="space.200">
        <Stack alignInline="center" space="space.150">
          {isLoggedIn ? (
            <>
              <Tooltip content="Refresh notifications" position="right">
                <IconButton
                  label="Refresh notifications"
                  icon={(iconProps) =>
                    status === 'loading' ? (
                      <Spinner
                        label="Refresh notifications"
                        size={'medium'}
                        appearance="invert"
                      />
                    ) : (
                      <RefreshIcon
                        {...iconProps}
                        size="medium"
                        primaryColor="white"
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
                      size="medium"
                      primaryColor="white"
                    />
                  )}
                  appearance="subtle"
                  shape="circle"
                  onClick={() => toggleSettings()}
                  testId="sidebar-settings"
                />
              </Tooltip>
            </>
          ) : (
            <Tooltip content="Quit Atlassify" position="right">
              <IconButton
                label="Quit Atlassify"
                icon={(iconProps) => (
                  <CrossCircleIcon
                    {...iconProps}
                    size="medium"
                    primaryColor="white"
                    secondaryColor={colors['sidebar']}
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
