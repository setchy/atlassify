import { type FC, Fragment, memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton } from '@atlaskit/button/new';
import CollapseVerticalIcon from '@atlaskit/icon/core/collapse-vertical';
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

import { useAppContext } from '../hooks/useAppContext';
import { useShortcutActions } from '../hooks/useShortcutActions';
import useFiltersStore from '../stores/useFiltersStore';

import { hasActiveFilters } from '../utils/notifications/filters';
import { AtlassifyIcon } from './icons/AtlassifyIcon';

const SidebarComponent: FC = () => {
  const {
    isLoggedIn,
    settings,
    status,
    hasMoreAccountNotifications,
    notificationCount,
    hasNotifications,
  } = useAppContext();

  const { t } = useTranslation();

  const { shortcuts } = useShortcutActions();

  // Subscribe to all filter states to re-render when they change
  const engagementStates = useFiltersStore((s) => s.engagementStates);
  const categories = useFiltersStore((s) => s.categories);
  const actors = useFiltersStore((s) => s.actors);
  const readStates = useFiltersStore((s) => s.readStates);
  const products = useFiltersStore((s) => s.products);

  // Memoize filter check to avoid recalculating on every render
  // biome-ignore lint/correctness/useExhaustiveDependencies: We intentionally subscribe to all filter states to trigger recalculation
  const hasFilters = useMemo(
    () => hasActiveFilters(),
    [engagementStates, categories, actors, readStates, products],
  );

  const theme = useThemeObserver();

  const sidebarIconColorToken =
    theme.colorMode === 'dark'
      ? token('color.text.accent.gray.bolder')
      : token('color.text.inverse');

  return (
    <div className="flex flex-col w-sidebar h-full bg-atlassify-sidebar">
      <Stack grow="fill" spread="space-between">
        <Box paddingBlockStart="space.200">
          <Stack alignInline="center" space="space.100">
            <Tooltip
              content={t('sidebar.home')}
              position="right"
              shortcut={[shortcuts.home.key]}
            >
              <IconButton
                appearance="subtle"
                icon={() => <AtlassifyIcon size={32} />}
                label={t('sidebar.home')}
                onClick={() => shortcuts.home.action()}
                shape="circle"
                testId="sidebar-home"
              />
            </Tooltip>

            <Tooltip
              content={t('sidebar.notifications.tooltip', {
                count: notificationCount,
                countSuffix: hasMoreAccountNotifications ? '+' : '',
                countType: settings.fetchOnlyUnreadNotifications
                  ? t('sidebar.notifications.unread')
                  : t('sidebar.notifications.read'),
              })}
              position="right"
              shortcut={[shortcuts.myNotifications.key]}
            >
              <IconButton
                appearance={hasNotifications ? 'primary' : 'subtle'}
                icon={(iconProps) => (
                  <NotificationIcon
                    {...iconProps}
                    color={sidebarIconColorToken}
                  />
                )}
                label={t('sidebar.notifications.label')}
                onClick={() => shortcuts.myNotifications.action()}
                shape="circle"
                spacing="compact"
                testId="sidebar-notifications"
              />
            </Tooltip>

            {isLoggedIn && (
              <Fragment>
                <Tooltip
                  content={t('sidebar.toggles.unreadOnly.tooltip')}
                  position="right"
                  shortcut={[shortcuts.toggleReadUnread.key]}
                >
                  <Toggle
                    id="toggle-unread-only"
                    isChecked={settings.fetchOnlyUnreadNotifications}
                    label={t('sidebar.toggles.unreadOnly.label')}
                    onChange={() => shortcuts.toggleReadUnread.action()}
                    size="regular"
                    testId="sidebar-toggle-unread-only"
                  />
                </Tooltip>

                <Tooltip
                  content={t('sidebar.toggles.groupByProduct.tooltip')}
                  position="right"
                  shortcut={[shortcuts.groupByProduct.key]}
                >
                  <IconButton
                    appearance={
                      settings.groupNotificationsByProduct
                        ? 'discovery'
                        : 'subtle'
                    }
                    icon={() => (
                      <ListBulletedIcon
                        color={sidebarIconColorToken}
                        label="groupByProduct"
                      />
                    )}
                    label={t('sidebar.toggles.groupByProduct.label')}
                    onClick={() => shortcuts.groupByProduct.action()}
                    shape="circle"
                    spacing="compact"
                    testId="sidebar-group-by-product"
                  />
                </Tooltip>

                <Tooltip
                  content={t('sidebar.toggles.groupByTitle.tooltip')}
                  position="right"
                  shortcut={[shortcuts.groupByTitle.key]}
                >
                  <IconButton
                    appearance={
                      settings.groupNotificationsByTitle
                        ? 'discovery'
                        : 'subtle'
                    }
                    icon={() => (
                      <CollapseVerticalIcon
                        color={sidebarIconColorToken}
                        label="groupByTitle"
                      />
                    )}
                    label={t('sidebar.toggles.groupByTitle.label')}
                    onClick={() => shortcuts.groupByTitle.action()}
                    shape="circle"
                    spacing="compact"
                    testId="sidebar-group-by-title"
                  />
                </Tooltip>

                <Tooltip
                  content={t('sidebar.filters.tooltip')}
                  position="right"
                  shortcut={[shortcuts.filters.key]}
                >
                  <IconButton
                    appearance={hasFilters ? 'discovery' : 'subtle'}
                    icon={(iconProps) => (
                      <FilterIcon
                        {...iconProps}
                        color={sidebarIconColorToken}
                      />
                    )}
                    label={t('sidebar.filters.label')}
                    onClick={() => shortcuts.filters.action()}
                    shape="circle"
                    spacing="compact"
                    testId="sidebar-filter-notifications"
                  />
                </Tooltip>
              </Fragment>
            )}
          </Stack>
        </Box>

        <Box paddingBlockEnd="space.200">
          <Stack alignInline="center" space="space.150">
            {isLoggedIn ? (
              <Fragment>
                <Tooltip
                  content={t('sidebar.refresh.tooltip')}
                  position="right"
                  shortcut={[shortcuts.refresh.key]}
                >
                  <IconButton
                    appearance="subtle"
                    icon={(iconProps) =>
                      status === 'loading' ? (
                        <Spinner
                          appearance="invert"
                          label={t('sidebar.refresh.label')}
                          size="medium"
                        />
                      ) : (
                        <RefreshIcon
                          {...iconProps}
                          color={sidebarIconColorToken}
                        />
                      )
                    }
                    isDisabled={status === 'loading'}
                    label={t('sidebar.refresh.label')}
                    onClick={() => shortcuts.refresh.action()}
                    shape="circle"
                    testId="sidebar-refresh"
                  />
                </Tooltip>

                <Tooltip
                  content={t('sidebar.settings.tooltip')}
                  position="right"
                  shortcut={[shortcuts.settings.key]}
                >
                  <IconButton
                    appearance="subtle"
                    icon={(iconProps) => (
                      <SettingsIcon
                        {...iconProps}
                        color={sidebarIconColorToken}
                      />
                    )}
                    label={t('sidebar.settings.label')}
                    onClick={() => shortcuts.settings.action()}
                    shape="circle"
                    testId="sidebar-settings"
                  />
                </Tooltip>
              </Fragment>
            ) : (
              <Tooltip
                content={t('sidebar.quit.tooltip', {
                  appName: APPLICATION.NAME,
                })}
                position="right"
                shortcut={[shortcuts.quit.key]}
              >
                <IconButton
                  appearance="subtle"
                  icon={(iconProps) => (
                    <CrossCircleIcon
                      {...iconProps}
                      color={sidebarIconColorToken}
                    />
                  )}
                  label={t('sidebar.quit.label', {
                    appName: APPLICATION.NAME,
                  })}
                  onClick={() => shortcuts.quit.action()}
                  shape="circle"
                  testId="sidebar-quit"
                />
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Stack>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const Sidebar = memo(SidebarComponent);
