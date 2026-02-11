import { type FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { IconButton, SplitButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import RetryIcon from '@atlaskit/icon/core/retry';
import ZoomInIcon from '@atlaskit/icon/core/zoom-in';
import ZoomOutIcon from '@atlaskit/icon/core/zoom-out';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/dist/types/types';
import Select from '@atlaskit/select';
import { setGlobalTheme } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Theme } from '../../../shared/theme';

import useSettingsStore from '../../stores/useSettingsStore';

import { LANGUAGES } from '../../i18n/types';

import { loadLanguageLocale } from '../../utils/storage';
import { setTheme } from '../../utils/theme';
import {
  canDecreaseZoom,
  canIncreaseZoom,
  decreaseZoom,
  increaseZoom,
  resetZoomLevel,
  zoomLevelToPercentage,
} from '../../utils/zoom';

export const AppearanceSettings: FC = () => {
  const updateSetting = useSettingsStore((s) => s.updateSetting);

  const { t, i18n } = useTranslation();

  const theme = useSettingsStore((s) => s.theme);

  const zoomPercentage = zoomLevelToPercentage(
    window.atlassify.zoom.getLevel(),
  );

  const zoomBoxStyles = xcss({
    backgroundColor: 'color.background.accent.gray.subtlest',
  });

  useEffect(() => {
    window.atlassify.onSystemThemeUpdate((updatedTheme: Theme) => {
      if (theme === Theme.SYSTEM) {
        setTheme(updatedTheme);
        setGlobalTheme({ colorMode: 'auto' });
      }
    });
  }, [theme]);

  const themeOptions: OptionsPropType = [
    {
      name: 'theme',
      label: 'System',
      value: Theme.SYSTEM,
      testId: 'theme-system',
    },
    {
      name: 'theme',
      label: 'Light',
      value: Theme.LIGHT,
      testId: 'theme-light',
    },
    { name: 'theme', label: 'Dark', value: Theme.DARK, testId: 'theme-dark' },
  ];

  const handleLanguageChange = useCallback(
    (option) => {
      i18n.changeLanguage(option.value);
    },
    [i18n],
  );

  const locale = loadLanguageLocale();

  return (
    <Stack space="space.100">
      <Heading size="small">{t('settings.appearance.title')}</Heading>

      <Box paddingInlineStart="space.050">
        <Inline alignBlock="start" space="space.100">
          <Text id="language-label" weight="medium">
            {t('settings.appearance.language')}:
          </Text>
          <Select
            defaultValue={LANGUAGES.find((lang) =>
              locale.startsWith(lang.value),
            )}
            menuPortalTarget={document.body}
            onChange={(option) => {
              handleLanguageChange(option);
            }}
            options={LANGUAGES}
            placeholder={t('settings.appearance.language_select')}
            testId="settings-language-selector"
          />
        </Inline>
      </Box>

      <Box paddingInlineStart="space.050">
        <Inline alignBlock="start" space="space.100">
          <Text id="theme-label" weight="medium">
            {t('settings.appearance.theme')}:
          </Text>
          <RadioGroup
            defaultValue={theme}
            labelId="theme-label"
            onChange={(evt) => {
              updateSetting('theme', evt.target.value as Theme);
            }}
            options={themeOptions}
            value={theme}
          />
        </Inline>
      </Box>

      <Box paddingInlineStart="space.050">
        <Inline alignBlock="center" space="space.100">
          <Text id="zoom-label" weight="medium">
            {t('settings.appearance.zoom')}:
          </Text>
          <Inline xcss={zoomBoxStyles}>
            <SplitButton spacing="compact">
              <Inline alignBlock="center">
                <Box paddingInline="space.150">
                  <Text>{zoomPercentage.toFixed(0)}%</Text>
                </Box>
                <Tooltip
                  content={t('settings.appearance.zoom_out')}
                  position="bottom"
                >
                  <IconButton
                    icon={ZoomOutIcon}
                    isDisabled={!canDecreaseZoom(zoomPercentage)}
                    label={t('settings.appearance.zoom_out')}
                    onClick={() => decreaseZoom(zoomPercentage)}
                    shape="circle"
                    spacing="compact"
                    testId="settings-zoom-out"
                  />
                </Tooltip>
                <Tooltip
                  content={t('settings.appearance.zoom_in')}
                  position="bottom"
                >
                  <IconButton
                    icon={ZoomInIcon}
                    isDisabled={!canIncreaseZoom(zoomPercentage)}
                    label={t('settings.appearance.zoom_in')}
                    onClick={() => increaseZoom(zoomPercentage)}
                    shape="circle"
                    spacing="compact"
                    testId="settings-zoom-in"
                  />
                </Tooltip>
              </Inline>
              <Tooltip
                content={t('settings.appearance.zoom_reset')}
                position="bottom"
              >
                <IconButton
                  icon={RetryIcon}
                  label={t('settings.appearance.zoom_reset')}
                  onClick={() => resetZoomLevel()}
                  shape="circle"
                  spacing="compact"
                  testId="settings-zoom-reset"
                />
              </Tooltip>
            </SplitButton>
          </Inline>
        </Inline>
      </Box>
    </Stack>
  );
};
