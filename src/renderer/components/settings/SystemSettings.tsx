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

import { AppContext } from '../../context/App';
import { defaultSettings } from '../../context/defaults';
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
            aria-labelledby="openLinks-label"
            defaultValue={settings.openLinks}
            onChange={(evt) => {
              updateSetting('openLinks', evt.target.value as OpenPreference);
            }}
            options={openLinksOptions}
            value={settings.openLinks}
          />
        </Inline>
      </Box>

      <Inline space="space.100">
        <Checkbox
          isChecked={settings.keyboardShortcutEnabled}
          label={t('settings.system.keyboard_shortcut')}
          name="keyboardShortcutEnabled"
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
          isChecked={settings.showNotificationsCountInTray}
          label={t('settings.system.show_count_in_tray')}
          name="showNotificationsCountInTray"
          onChange={(evt) =>
            updateSetting('showNotificationsCountInTray', evt.target.checked)
          }
        />
      )}

      <Checkbox
        isChecked={settings.showSystemNotifications}
        label={t('settings.system.system_notifications')}
        name="showNotifications"
        onChange={(evt) =>
          updateSetting('showSystemNotifications', evt.target.checked)
        }
      />

      <Inline alignBlock="center" space="space.100">
        <Checkbox
          isChecked={settings.playSoundNewNotifications}
          label={t('settings.system.play_sound')}
          name="playSoundNewNotifications"
          onChange={(evt) =>
            updateSetting('playSoundNewNotifications', evt.target.checked)
          }
        />
        <Inline testId="settings-volume-group" xcss={volumeBoxStyles}>
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
                  icon={VolumeLowIcon}
                  label={t('settings.system.volume_down')}
                  onClick={() => {
                    const newVolume = Math.max(
                      settings.notificationVolume - 10,
                      10,
                    );

                    updateSetting('notificationVolume', newVolume);
                  }}
                  shape="circle"
                  spacing="compact"
                  testId="settings-volume-down"
                />
              </Tooltip>
              <Tooltip
                content={t('settings.system.volume_up')}
                position="bottom"
              >
                <IconButton
                  icon={VolumeHighIcon}
                  label={t('settings.system.volume_up')}
                  onClick={() => {
                    const newVolume = Math.min(
                      settings.notificationVolume + 10,
                      100,
                    );

                    updateSetting('notificationVolume', newVolume);
                  }}
                  shape="circle"
                  spacing="compact"
                  testId="settings-volume-up"
                />
              </Tooltip>
            </Inline>
            <Tooltip
              content={t('settings.system.volume_reset')}
              position="bottom"
            >
              <IconButton
                icon={RetryIcon}
                label={t('settings.system.volume_reset')}
                onClick={() =>
                  updateSetting(
                    'notificationVolume',
                    defaultSettings.notificationVolume,
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
          isChecked={settings.useAlternateIdleIcon}
          label={t('settings.system.alternate_icon')}
          name="useAlternateIdleIcon"
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
          isChecked={settings.openAtStartup}
          label={t('settings.system.startup')}
          name="openAtStartUp"
          onChange={(evt) => updateSetting('openAtStartup', evt.target.checked)}
        />
      )}
    </Stack>
  );
};
