import { type FC, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import ListIcon from '@atlaskit/icon/glyph/list';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import { AtlasIcon } from '@atlaskit/logo';
import { Box, Stack, Text } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import Toggle from '@atlaskit/toggle';
import { AppContext } from '../context/App';
import { quitApp } from '../utils/comms';
import { getFilterCount } from '../utils/helpers';
import { openMyNotifications } from '../utils/links';
import { getNotificationCount } from '../utils/notifications';

export const Sidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    notifications,
    fetchNotifications,
    isLoggedIn,
    settings,
    updateSetting,
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
          <IconButton
            label="Home"
            title="Home"
            appearance="subtle"
            isTooltipDisabled={false}
            icon={(iconProps) => (
              <AtlasIcon {...iconProps} size="medium" appearance="inverse" />
            )}
            shape="circle"
            onClick={() => navigate('/', { replace: true })}
          />
        </div>

        <Stack alignInline="center" space="space.100">
          <Tooltip content={`${notificationsLabel} unread notifications`}>
            <Button
              iconBefore={(iconProps) => (
                <NotificationIcon
                  {...iconProps}
                  size="small"
                  primaryColor="white"
                />
              )}
              appearance="subtle"
              spacing="compact"
              onClick={() => openMyNotifications()}
            >
              {notificationsCount > 0 && (
                <Text color="color.text.inverse" size="small" weight="semibold">
                  {notificationsCount}
                </Text>
              )}
            </Button>
          </Tooltip>

          {isLoggedIn && (
            <>
              <Tooltip content="Show only unread notifications">
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
                />
              </Tooltip>

              <IconButton
                label="Group notifications by products"
                title="Group notifications by products"
                isTooltipDisabled={false}
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
                  settings.groupNotificationsByProduct ? 'discovery' : 'subtle'
                }
                spacing="compact"
                shape="circle"
              />

              <Tooltip content="Filters">
                <Button
                  iconBefore={(iconProps) => (
                    <FilterIcon
                      {...iconProps}
                      size="small"
                      primaryColor="white"
                    />
                  )}
                  appearance="subtle"
                  spacing="compact"
                  onClick={() => toggleFilters()}
                >
                  {filterCount > 0 && (
                    <Text
                      color="color.text.inverse"
                      size="small"
                      weight="semibold"
                    >
                      {filterCount}
                    </Text>
                  )}
                </Button>
              </Tooltip>
            </>
          )}
        </Stack>
      </div>

      <Box paddingBlock="space.200">
        {isLoggedIn && (
          <Stack alignInline="center" space="space.150">
            <IconButton
              label="Refresh notifications"
              title="Refresh notifications"
              isTooltipDisabled={false}
              icon={(iconProps) => (
                <RefreshIcon
                  {...iconProps}
                  size="medium"
                  primaryColor="white"
                />
              )}
              appearance="subtle"
              shape="circle"
              onClick={() => refreshNotifications()}
            />

            <IconButton
              label="Settings"
              title="Settings"
              isTooltipDisabled={false}
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
            />
          </Stack>
        )}

        {!isLoggedIn && (
          <IconButton
            label="Quit Atlasify"
            title="Quit Atlasify"
            isTooltipDisabled={false}
            icon={(iconProps) => (
              <CrossCircleIcon
                {...iconProps}
                size="medium"
                primaryColor="white"
              />
            )}
            shape="circle"
            onClick={() => quitApp()}
          />
        )}
      </Box>
    </div>
  );
};
