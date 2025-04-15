import { type FC, Fragment, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();

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

  const hasMoreNotifications = useMemo(() => {
    return notifications.some((n) => n.hasMoreNotifications);
  }, [notifications]);

  const hasFilters = hasAnyFiltersSet(settings);

  const theme = useThemeObserver();
  const sidebarIconColorToken =
    theme.colorMode === 'light'
      ? token('color.text.inverse')
      : token('color.text.accent.gray.bolder');

  return (
    <div className="fixed flex flex-col pl-sidebar -ml-sidebar w-sidebar h-full overflow-y-auto bg-atlassify-sidebar">
      <div className="flex flex-1 flex-col items-center">
        <Box paddingBlockStart="space.200">
          <Stack alignInline="center" space="space.100">
            <Tooltip content={t('sidebar.home')} position="right">
              <IconButton
                label={t('sidebar.home')}
                appearance="subtle"
                icon={() => <LogoIcon width={32} height={32} />}
                shape="circle"
                onClick={() => navigate('/', { replace: true })}
                testId="sidebar-home"
              />
            </Tooltip>

            <Tooltip
              // content={`${notificationsLabel} ${settings.fetchOnlyUnreadNotifications ? t('sidebar.notifications.unread') : ''}${t('sidebar.notifications.notifications')}`}
              content={t('sidebar.notifications.tooltip', {
                count: notificationsCount,
                countSuffix: hasMoreNotifications ? '+' : '',
                countType: settings.fetchOnlyUnreadNotifications
                  ? t('sidebar.notifications.unread')
                  : t('sidebar.notifications.read'),
              })}
              position="right"
            >
              <IconButton
                label={t('sidebar.notifications.label')}
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
                  content={t('sidebar.toggles.unreadOnly.tooltip')}
                  position="right"
                >
                  <Toggle
                    id="toggle-unread-only"
                    size="regular"
                    label={t('sidebar.toggles.unreadOnly.label')}
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
                  content={t('sidebar.toggles.groupByProduct.tooltip')}
                  position="right"
                >
                  <IconButton
                    label={t('sidebar.toggles.groupByProduct.label')}
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

                <Tooltip
                  content={t('sidebar.filters.tooltip')}
                  position="right"
                >
                  <IconButton
                    label={t('sidebar.filters.label')}
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
              <Tooltip content={t('sidebar.refresh.tooltip')} position="right">
                <IconButton
                  label={t('sidebar.refresh.label')}
                  icon={(iconProps) =>
                    status === 'loading' ? (
                      <Spinner
                        label={t('sidebar.refresh.label')}
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

              <Tooltip content={t('sidebar.settings.tooltip')} position="right">
                <IconButton
                  label={t('sidebar.settings.label')}
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
            <Tooltip
              content={t('sidebar.quit.tooltip', { name: APPLICATION.NAME })}
              position="right"
            >
              <IconButton
                label={t('sidebar.quit.label', { name: APPLICATION.NAME })}
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
