import { type FC, Fragment, useContext, useMemo } from 'react';
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
import Spinner from '@atlaskit/spinner';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { colors } from '../../../tailwind.config';
import { AppContext } from '../context/App';
import { Theme } from '../types';
import { quitApp } from '../utils/comms';
import { hasFiltersSet } from '../utils/filters';
import { openMyNotifications } from '../utils/links';
import { getNotificationCount } from '../utils/notifications/notifications';
import { getTheme } from '../utils/theme';

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
    return hasFiltersSet(settings);
  }, [settings]);

  return (
    <div className="fixed left-12 -ml-12 flex h-full w-12 flex-col overflow-y-auto ">
      <div className="flex flex-1 flex-col items-center">
        <Box
          paddingBlockStart="space.200"
          backgroundColor={
            getTheme() === Theme.DARK
              ? 'color.background.accent.blue.subtlest'
              : 'color.background.accent.blue.subtlest.hovered'
          }
        >
          <Stack alignInline="center" space="space.100">
            <Tooltip content="Home" position="right">
              <IconButton
                label="Home"
                appearance="subtle"
                icon={(iconProps) => (
                  <AtlasIcon
                    {...iconProps}
                    size="medium"
                    appearance="inverse"
                  />
                )}
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
                    size="small"
                    primaryColor={token('color.icon.inverse')}
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
                        size="small"
                        primaryColor={token('color.icon.inverse')}
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
                        size="small"
                        primaryColor={token('color.icon.inverse')}
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

      <Box
        paddingBlockEnd="space.200"
        backgroundColor={
          getTheme() === Theme.DARK
            ? 'color.background.accent.gray.subtlest'
            : 'color.background.accent.blue.subtle'
        }
      >
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
                        size={'medium'}
                        appearance="invert"
                      />
                    ) : (
                      <RefreshIcon
                        {...iconProps}
                        size="medium"
                        primaryColor={token('color.icon.inverse')}
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
                    <SettingsIcon {...iconProps} size="medium" />
                  )}
                  appearance="subtle"
                  shape="circle"
                  onClick={() => toggleSettings()}
                  testId="sidebar-settings"
                />
              </Tooltip>
            </Fragment>
          ) : (
            <Tooltip content="Quit Atlassify" position="right">
              <IconButton
                label="Quit Atlassify"
                icon={(iconProps) => (
                  <CrossCircleIcon
                    {...iconProps}
                    size="medium"
                    primaryColor={token('color.icon.inverse')}
                    secondaryColor={colors.sidebar}
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
