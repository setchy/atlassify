import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton, SplitButton } from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Heading from '@atlaskit/heading';
import RetryIcon from '@atlaskit/icon/core/retry';
import VolumeHighIcon from '@atlaskit/icon/core/volume-high';
import VolumeLowIcon from '@atlaskit/icon/core/volume-low';
import InlineMessage from '@atlaskit/inline-message';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { Radio } from '@atlaskit/radio';
import Tooltip from '@atlaskit/tooltip';

import { APPLICATION } from '../../../shared/constants';

import { OpenPreference, useSettingsStore } from '../../stores';

import {
  canDecreaseVolume,
  canIncreaseVolume,
  decreaseVolume,
  increaseVolume,
} from '../../utils/ui/volume';

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
  const openAtStartup = useSettingsStore((s) => s.openAtStartup);

  const volumeBoxStyles = xcss({
    backgroundColor: 'color.background.accent.gray.subtlest',

    visibility: playSoundNewNotifications ? 'visible' : 'hidden',
  });

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.system.title')}</Heading>

      <Box paddingInlineStart="space.050">
        <Inline alignBlock="center" space="space.100">
          <Text weight="medium">{t('settings.system.open_links')}:</Text>
          <Radio
            isChecked={openLinks === OpenPreference.FOREGROUND}
            label={t('settings.system.open_links_foreground')}
            name="openLinks"
            onChange={() =>
              updateSetting('openLinks', OpenPreference.FOREGROUND)
            }
            value={OpenPreference.FOREGROUND}
          />
          <Radio
            isChecked={openLinks === OpenPreference.BACKGROUND}
            label={t('settings.system.open_links_background')}
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
          label={t('settings.system.keyboard_shortcut')}
          name="keyboardShortcutEnabled"
          onChange={() => toggleSetting('keyboardShortcutEnabled')}
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

      <Inline space="space.100">
        <Checkbox
          isChecked={showSystemNotifications}
          label={t('settings.system.system_notifications')}
          name="showNotifications"
          onChange={() => toggleSetting('showSystemNotifications')}
        />
        <InlineMessage appearance="info">
          <div className="w-60 text-xs">
            {t('settings.system.system_notifications_help')}
          </div>
        </InlineMessage>
      </Inline>

      <Inline alignBlock="center" space="space.100">
        <Checkbox
          isChecked={playSoundNewNotifications}
          label={t('settings.system.play_sound')}
          name="playSoundNewNotifications"
          onChange={() => toggleSetting('playSoundNewNotifications')}
        />
        <Inline testId="settings-volume-group" xcss={volumeBoxStyles}>
          <SplitButton spacing="compact">
            <Inline alignBlock="center">
              <Box paddingInline="space.150">
                <Text>{notificationVolume.toFixed(0)}%</Text>
              </Box>
              <Tooltip
                content={t('settings.system.volume_down')}
                position="bottom"
              >
                <IconButton
                  icon={VolumeLowIcon}
                  isDisabled={!canDecreaseVolume(notificationVolume)}
                  label={t('settings.system.volume_down')}
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
                content={t('settings.system.volume_up')}
                position="bottom"
              >
                <IconButton
                  icon={VolumeHighIcon}
                  isDisabled={!canIncreaseVolume(notificationVolume)}
                  label={t('settings.system.volume_up')}
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
              content={t('settings.system.volume_reset')}
              position="bottom"
            >
              <IconButton
                icon={RetryIcon}
                label={t('settings.system.volume_reset')}
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

      {!window.atlassify.platform.isLinux() && (
        <Inline space="space.100">
          <Checkbox
            isChecked={openAtStartup}
            label={t('settings.system.startup')}
            name="openAtStartUp"
            onChange={() => toggleSetting('openAtStartup')}
          />
          <InlineMessage appearance="info">
            <div className="w-60 text-xs">
              {t('settings.system.startup_help', {
                appName: APPLICATION.NAME,
              })}
            </div>
          </InlineMessage>
        </Inline>
      )}
    </Stack>
  );
};
