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
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/types';
import Tooltip from '@atlaskit/tooltip';

import { APPLICATION } from '../../../shared/constants';

import { OpenPreference, useSettingsStore } from '../../stores';

import {
  canDecreaseVolume,
  canIncreaseVolume,
  decreaseVolume,
  increaseVolume,
} from '../../utils/notifications/sound';

export const SystemSettings: FC = () => {
  const { t } = useTranslation();

  const updateSetting = useSettingsStore((s) => s.updateSetting);
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

    visibility: playSoundNewNotifications ? 'visible' : 'hidden',
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
            defaultValue={openLinks}
            labelId="openLinks-label"
            onChange={(evt) => {
              updateSetting('openLinks', evt.target.value as OpenPreference);
            }}
            options={openLinksOptions}
            value={openLinks}
          />
        </Inline>
      </Box>

      <Inline space="space.100">
        <Checkbox
          isChecked={keyboardShortcutEnabled}
          label={t('settings.system.keyboard_shortcut')}
          name="keyboardShortcutEnabled"
          onChange={() =>
            updateSetting('keyboardShortcutEnabled', !keyboardShortcutEnabled)
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

      <Inline space="space.100">
        <Checkbox
          isChecked={showSystemNotifications}
          label={t('settings.system.system_notifications')}
          name="showNotifications"
          onChange={() =>
            updateSetting('showSystemNotifications', !showSystemNotifications)
          }
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
          onChange={() =>
            updateSetting(
              'playSoundNewNotifications',
              !playSoundNewNotifications,
            )
          }
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
            onChange={() => updateSetting('openAtStartup', !openAtStartup)}
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
