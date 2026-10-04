import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton, SplitButton } from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { cssMap, cx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import RetryIcon from '@atlaskit/icon/core/retry';
import VolumeHighIcon from '@atlaskit/icon/core/volume-high';
import VolumeLowIcon from '@atlaskit/icon/core/volume-low';
import InlineMessage from '@atlaskit/inline-message';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { Radio } from '@atlaskit/radio';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { APPLICATION } from '../../../shared/constants';

import { OpenPreference, useSettingsStore } from '../../stores';

import {
  canDecreaseVolume,
  canIncreaseVolume,
  decreaseVolume,
  increaseVolume,
} from '../../utils/ui/volume';

const styles = cssMap({
  root: {
    backgroundColor: token('color.background.accent.gray.subtlest'),
  },
  visible: {
    visibility: 'visible',
  },
  hidden: {
    visibility: 'hidden',
  },
  row: {
    paddingInlineStart: token('space.050'),
  },
  count: {
    paddingInline: token('space.150'),
  },
});

export const SystemSettings: FC = () => {
  const { t } = useTranslation();

  // Setting store actions
  const toggleSetting = useSettingsStore((s) => s.toggleSetting);
  const updateSetting = useSettingsStore((s) => s.updateSetting);

  // Setting store values
  const openLinks = useSettingsStore((s) => s.openLinks);
  const keyboardShortcutEnabled = useSettingsStore(
    (s) => s.keyboardShortcutEnabled,
  );
  const showSystemNotifications = useSettingsStore(
    (s) => s.showSystemNotifications,
  );
  const playSoundNewNotifications = useSettingsStore(
    (s) => s.playSoundNewNotifications,
  );
  const notificationVolume = useSettingsStore((s) => s.notificationVolume);
  const enableAnonymousAnalytics = useSettingsStore(
    (s) => s.enableAnonymousAnalytics,
  );
  const openAtStartup = useSettingsStore((s) => s.openAtStartup);
  const keepWindowOnBlur = useSettingsStore((s) => s.keepWindowOnBlur);
  const useX11Backend = useSettingsStore((s) => s.useX11Backend);

  return (
    <Stack space="space.100">
      <Heading size="small">
        {t('settings.system.title', { defaultValue: 'System' })}
      </Heading>

      <Box xcss={styles.row}>
        <Inline alignBlock="center" space="space.100">
          <Text weight="medium">
            {t('settings.system.open_links', { defaultValue: 'Open Links' })}:
          </Text>
          <Radio
            isChecked={openLinks === OpenPreference.FOREGROUND}
            label={t('settings.system.open_links_foreground', {
              defaultValue: 'Foreground',
            })}
            name="openLinks"
            onChange={() =>
              updateSetting('openLinks', OpenPreference.FOREGROUND)
            }
            value={OpenPreference.FOREGROUND}
          />
          <Radio
            isChecked={openLinks === OpenPreference.BACKGROUND}
            label={t('settings.system.open_links_background', {
              defaultValue: 'Background',
            })}
            name="openLinks"
            onChange={() =>
              updateSetting('openLinks', OpenPreference.BACKGROUND)
            }
            value={OpenPreference.BACKGROUND}
          />
        </Inline>
      </Box>

      <Inline space="space.100">
        <Checkbox
          isChecked={keyboardShortcutEnabled}
          label={t('settings.system.keyboard_shortcut', {
            defaultValue: 'Enable keyboard shortcut',
          })}
          name="keyboardShortcutEnabled"
          onChange={() => toggleSetting('keyboardShortcutEnabled')}
        />
        <InlineMessage appearance="info">
          <div className="settings-help-text">
            {t('settings.system.keyboard_shortcut_help', {
              defaultValue:
                'When enabled, you can use the hotkeys {{shortcut}} to show or hide {{appName}}.',
              shortcut: APPLICATION.DEFAULT_KEYBOARD_SHORTCUT,
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>

      <Inline space="space.100">
        <Checkbox
          isChecked={showSystemNotifications}
          label={t('settings.system.system_notifications', {
            defaultValue: 'Show system notifications',
          })}
          name="showNotifications"
          onChange={() => toggleSetting('showSystemNotifications')}
        />
        <InlineMessage appearance="info">
          <div className="settings-help-text">
            {t('settings.system.system_notifications_help', {
              defaultValue:
                'Display native operating system notifications for new unread notifications.',
            })}
          </div>
        </InlineMessage>
      </Inline>

      <Inline alignBlock="center" space="space.100">
        <Checkbox
          isChecked={playSoundNewNotifications}
          label={t('settings.system.play_sound', {
            defaultValue: 'Play sound for new notifications',
          })}
          name="playSoundNewNotifications"
          onChange={() => toggleSetting('playSoundNewNotifications')}
        />
        <Inline
          testId="settings-volume-group"
          xcss={cx(
            styles.root,
            playSoundNewNotifications ? styles.visible : styles.hidden,
          )}
        >
          <SplitButton spacing="compact">
            <Inline alignBlock="center">
              <Box xcss={styles.count}>
                <Text>{notificationVolume.toFixed(0)}%</Text>
              </Box>
              <Tooltip
                content={t('settings.system.volume_down', {
                  defaultValue: 'Volume down',
                })}
                position="bottom"
              >
                <IconButton
                  icon={VolumeLowIcon}
                  isDisabled={!canDecreaseVolume(notificationVolume)}
                  label={t('settings.system.volume_down', {
                    defaultValue: 'Volume down',
                  })}
                  onClick={() => {
                    updateSetting(
                      'notificationVolume',
                      decreaseVolume(notificationVolume),
                    );
                  }}
                  shape="circle"
                  spacing="compact"
                  testId="settings-volume-down"
                />
              </Tooltip>
              <Tooltip
                content={t('settings.system.volume_up', {
                  defaultValue: 'Volume up',
                })}
                position="bottom"
              >
                <IconButton
                  icon={VolumeHighIcon}
                  isDisabled={!canIncreaseVolume(notificationVolume)}
                  label={t('settings.system.volume_up', {
                    defaultValue: 'Volume up',
                  })}
                  onClick={() => {
                    updateSetting(
                      'notificationVolume',
                      increaseVolume(notificationVolume),
                    );
                  }}
                  shape="circle"
                  spacing="compact"
                  testId="settings-volume-up"
                />
              </Tooltip>
            </Inline>
            <Tooltip
              content={t('settings.system.volume_reset', {
                defaultValue: 'Reset volume',
              })}
              position="bottom"
            >
              <IconButton
                icon={RetryIcon}
                label={t('settings.system.volume_reset', {
                  defaultValue: 'Reset volume',
                })}
                onClick={() =>
                  updateSetting(
                    'notificationVolume',
                    useSettingsStore.getInitialState().notificationVolume,
                  )
                }
                shape="circle"
                spacing="compact"
                testId="settings-volume-reset"
              />
            </Tooltip>
          </SplitButton>
        </Inline>
      </Inline>

      <Inline space="space.100">
        <Checkbox
          isChecked={keepWindowOnBlur}
          label={t('settings.system.keep_window_on_blur', {
            defaultValue: 'Keep window open when it loses focus',
          })}
          name="keepWindowOnBlur"
          onChange={() => toggleSetting('keepWindowOnBlur')}
        />
        <InlineMessage appearance="info">
          <div className="settings-help-text">
            {t('settings.system.keep_window_on_blur_help', {
              defaultValue:
                'Prevent the {{appName}} window from automatically hiding when you click outside it.',
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>

      <Inline space="space.100">
        <Checkbox
          isChecked={enableAnonymousAnalytics}
          label={t('settings.system.anonymous_analytics', {
            defaultValue: 'Share anonymous usage analytics',
          })}
          name="enableAnonymousAnalytics"
          onChange={() => toggleSetting('enableAnonymousAnalytics')}
        />
        <InlineMessage appearance="info">
          <div className="settings-help-text">
            {t('settings.system.anonymous_analytics_help', {
              defaultValue:
                'Help improve {{appName}} by sending anonymous usage events (for example: screens visited and actions used). Atlassian API tokens and notification content are never sent.',
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>

      {!window.atlassify.platform.isLinux() && (
        <Inline space="space.100">
          <Checkbox
            isChecked={openAtStartup}
            label={t('settings.system.startup', {
              defaultValue: 'Open at startup',
            })}
            name="openAtStartUp"
            onChange={() => toggleSetting('openAtStartup')}
          />
          <InlineMessage appearance="info">
            <div className="settings-help-text">
              {t('settings.system.startup_help', {
                defaultValue: 'Launch {{appName}} automatically at startup.',
                appName: APPLICATION.NAME,
              })}
            </div>
          </InlineMessage>
        </Inline>
      )}

      {window.atlassify.platform.isLinux() && (
        <Inline space="space.100">
          <Checkbox
            isChecked={useX11Backend}
            label={t('settings.system.use_x11_backend', {
              defaultValue: 'Use X11 backend (restart required)',
            })}
            name="useX11Backend"
            onChange={() => toggleSetting('useX11Backend')}
          />
          <InlineMessage appearance="info">
            <div className="settings-help-text">
              {t('settings.system.use_x11_backend_help', {
                defaultValue:
                  'Run under X11/XWayland so the window can open next to the tray icon. This may soften text on displays using fractional scaling and takes effect after restarting {{appName}}.',
                appName: APPLICATION.NAME,
              })}
            </div>
          </InlineMessage>
        </Inline>
      )}
    </Stack>
  );
};
