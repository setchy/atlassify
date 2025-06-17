import { type FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton, SplitButton } from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import RetryIcon from '@atlaskit/icon/core/retry';
import VolumeHighIcon from '@atlaskit/icon/core/volume-high';
import VolumeLowIcon from '@atlaskit/icon/core/volume-low';
import InlineMessage from '@atlaskit/inline-message';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/types';
import Tooltip from '@atlaskit/tooltip';

import { APPLICATION } from '../../../shared/constants';
import { AppContext, defaultSettings } from '../../context/App';
import { OpenPreference } from '../../types';

export const SystemSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);
  const { t } = useTranslation();

  const openLinksOptions: OptionsPropType = [
    {
      name: 'openLinks',
      label: t('settings.system.open_links_foreground'),
      value: OpenPreference.FOREGROUND,
    },
    {
      name: 'openLinks',
      label: t('settings.system.open_links_background'),
      value: OpenPreference.BACKGROUND,
    },
  ];

  const volumeBoxStyles = xcss({
    backgroundColor: 'color.background.accent.gray.subtlest',
    visibility: settings.playSoundNewNotifications ? 'visible' : 'hidden',
  });

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.system.title')}</Heading>

      <Box paddingInlineStart="space.050">
        <Inline space="space.100">
          <Text id="openLinks-label" weight="medium">
            {t('settings.system.open_links')}:
          </Text>
          <RadioGroup
            options={openLinksOptions}
            defaultValue={settings.openLinks}
            value={settings.openLinks}
            onChange={(evt) => {
              updateSetting('openLinks', evt.target.value as OpenPreference);
            }}
            aria-labelledby="openLinks-label"
          />
        </Inline>
      </Box>

      <Inline space="space.100">
        <Checkbox
          name="keyboardShortcutEnabled"
          label={t('settings.system.keyboard_shortcut')}
          isChecked={settings.keyboardShortcutEnabled}
          onChange={(evt) =>
            updateSetting('keyboardShortcutEnabled', evt.target.checked)
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.system.keyboard_shortcut_help', {
              shortcut: APPLICATION.DEFAULT_KEYBOARD_SHORTCUT,
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>

      {window.atlassify.platform.isMacOS() && (
        <Checkbox
          name="showNotificationsCountInTray"
          label={t('settings.system.show_count_in_tray')}
          isChecked={settings.showNotificationsCountInTray}
          onChange={(evt) =>
            updateSetting('showNotificationsCountInTray', evt.target.checked)
          }
        />
      )}

      <Checkbox
        name="showNotifications"
        label={t('settings.system.system_notifications')}
        isChecked={settings.showSystemNotifications}
        onChange={(evt) =>
          updateSetting('showSystemNotifications', evt.target.checked)
        }
      />

      <Inline space="space.100" alignBlock="center">
        <Checkbox
          name="playSoundNewNotifications"
          label={t('settings.system.play_sound')}
          isChecked={settings.playSoundNewNotifications}
          onChange={(evt) =>
            updateSetting('playSoundNewNotifications', evt.target.checked)
          }
        />
        <Inline xcss={volumeBoxStyles} testId="settings-volume-group">
          <SplitButton spacing="compact">
            <Inline alignBlock="center">
              <Box paddingInline="space.150">
                <Text>{settings.notificationVolume.toFixed(0)}%</Text>
              </Box>
              <Tooltip
                content={t('settings.system.volume_down')}
                position="bottom"
              >
                <IconButton
                  label={t('settings.system.volume_down')}
                  icon={VolumeLowIcon}
                  shape="circle"
                  spacing="compact"
                  onClick={() => {
                    const newVolume = Math.max(
                      settings.notificationVolume - 10,
                      10,
                    );

                    updateSetting('notificationVolume', newVolume);
                  }}
                  testId="settings-volume-down"
                />
              </Tooltip>
              <Tooltip
                content={t('settings.system.volume_up')}
                position="bottom"
              >
                <IconButton
                  label={t('settings.system.volume_up')}
                  icon={VolumeHighIcon}
                  shape="circle"
                  spacing="compact"
                  onClick={() => {
                    const newVolume = Math.min(
                      settings.notificationVolume + 10,
                      100,
                    );

                    updateSetting('notificationVolume', newVolume);
                  }}
                  testId="settings-volume-up"
                />
              </Tooltip>
            </Inline>
            <Tooltip
              content={t('settings.system.volume_reset')}
              position="bottom"
            >
              <IconButton
                label={t('settings.system.volume_reset')}
                icon={RetryIcon}
                shape="circle"
                spacing="compact"
                onClick={() =>
                  updateSetting(
                    'notificationVolume',
                    defaultSettings.notificationVolume,
                  )
                }
                testId="settings-volume-reset"
              />
            </Tooltip>
          </SplitButton>
        </Inline>
      </Inline>

      <Inline space="space.100">
        <Checkbox
          name="useAlternateIdleIcon"
          label={t('settings.system.alternate_icon')}
          isChecked={settings.useAlternateIdleIcon}
          onChange={(evt) =>
            updateSetting('useAlternateIdleIcon', evt.target.checked)
          }
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.system.alternate_icon_help', {
              appName: APPLICATION.NAME,
            })}
          </div>
        </InlineMessage>
      </Inline>

      {!window.atlassify.platform.isLinux() && (
        <Checkbox
          name="openAtStartUp"
          label={t('settings.system.startup')}
          isChecked={settings.openAtStartup}
          onChange={(evt) => updateSetting('openAtStartup', evt.target.checked)}
        />
      )}
    </Stack>
  );
};
