import { type FC, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import FilterIcon from '@atlaskit/icon/glyph/filter';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import { AtlasIcon } from '@atlaskit/logo';
import { Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../context/App';
import { quitApp } from '../utils/comms';
import { getFilterCount } from '../utils/helpers';
import { openAtlasifyRepository, openMyNotifications } from '../utils/links';
import { getNotificationCount } from '../utils/notifications';

export const Sidebar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { notifications, fetchNotifications, isLoggedIn, settings } =
    useContext(AppContext);

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

  const filterCount = useMemo(() => {
    return getFilterCount(settings);
  }, [settings]);

  return (
    <div className="fixed left-14 -ml-14 flex h-full w-14 flex-col overflow-y-auto bg-gray-sidebar">
      <div className="flex flex-1 flex-col items-center py-4">
        <div className="mx-auto my-3">
          <Button
            title="Open Atlasify on GitHub"
            appearance="subtle"
            onClick={() => openAtlasifyRepository()}
          >
            <AtlasIcon size="medium" appearance="brand" />
          </Button>
        </div>

        <Stack alignInline="center" space="space.100">
          <Tooltip content={`${notificationsCount} Unread Notifications`}>
            <IconButton
              label={`${notificationsCount} Unread Notifications`}
              icon={(iconProps) => (
                <NotificationIcon
                  {...iconProps}
                  size="small"
                  primaryColor="white"
                />
              )}
              appearance="subtle"
              spacing="compact"
              onClick={() => openMyNotifications()}
            />

            {notificationsCount > 0 && (
              <span className="text-xs text-white">{notificationsCount}</span>
            )}
          </Tooltip>

          {isLoggedIn && (
            <Tooltip content="Filters">
              <IconButton
                label="Filters"
                icon={(iconProps) => (
                  <FilterIcon
                    {...iconProps}
                    size="small"
                    primaryColor="white"
                  />
                )}
                appearance="subtle"
                shape="circle"
                onClick={() => toggleFilters()}
              />

              {filterCount > 0 && (
                <span className="text-xs text-white">{filterCount}</span>
              )}
            </Tooltip>
          )}

          {/* 
          <IconButton
            label="My Issues"
            title="My Issues"
            icon={(iconProps) => (
              <IssuesIcon {...iconProps} size="small" primaryColor="white" />
            )}
            appearance="subtle"
            spacing="compact"
            onClick={() => openMyIssues()}
          />

          <IconButton
            label="My Pull Requests"
            title="My Pull Requests"
            icon={(iconProps) => (
              <BitbucketPullrequestsIcon
                {...iconProps}
                size="small"
                primaryColor="white"
              />
            )}
            appearance="subtle"
            spacing="compact"
            onClick={() => openMyPullRequests()}
          />
          */}
        </Stack>
      </div>

      <div className="px-3 py-4">
        {isLoggedIn && (
          <Stack alignInline="center" space="space.150">
            <IconButton
              label="Refresh Notifications"
              title="Refresh Notifications"
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
            icon={(iconProps) => (
              <CrossCircleIcon
                {...iconProps}
                size="medium"
                primaryColor="white"
              />
            )}
            appearance="subtle"
            onClick={() => quitApp()}
          />
        )}
      </div>
    </div>
  );
};
