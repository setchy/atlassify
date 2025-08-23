import { type FC, useCallback, useContext, useEffect, useState } from 'react';
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

import { AppContext } from '../../context/App';
import { LANGUAGES } from '../../i18n/types';
import { loadLanguageLocale } from '../../utils/storage';
import { setTheme } from '../../utils/theme';
import { zoomLevelToPercentage, zoomPercentageToLevel } from '../../utils/zoom';

let zoomResizeTimeout: NodeJS.Timeout;
const ZOOM_RESIZE_DELAY = 200;

export const AppearanceSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);
  const { t } = useTranslation();

  const [zoomPercentage, setZoomPercentage] = useState(
    zoomLevelToPercentage(window.atlassify.zoom.getLevel()),
  );

  const zoomBoxStyles = xcss({
    backgroundColor: 'color.background.accent.gray.subtlest',
  });

  useEffect(() => {
    window.atlassify.onSystemThemeUpdate((updatedTheme: Theme) => {
      if (settings.theme === Theme.SYSTEM) {
        setTheme(updatedTheme);
        setGlobalTheme({ colorMode: 'auto' });
      }
    });
  }, [settings.theme]);

  window.addEventListener('resize', () => {
    // clear the timeout
    clearTimeout(zoomResizeTimeout);
    // start timing for event "completion"
    zoomResizeTimeout = setTimeout(() => {
      const zoomPercentage = zoomLevelToPercentage(
        window.atlassify.zoom.getLevel(),
      );
      setZoomPercentage(zoomPercentage);
      updateSetting('zoomPercentage', zoomPercentage);
    }, ZOOM_RESIZE_DELAY);
  });

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

  const { i18n } = useTranslation();

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
            aria-labelledby="theme-label"
            defaultValue={settings.theme}
            onChange={(evt) => {
              updateSetting('theme', evt.target.value as Theme);
            }}
            options={themeOptions}
            value={settings.theme}
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
                    label={t('settings.appearance.zoom_out')}
                    onClick={() =>
                      zoomPercentage > 0 &&
                      window.atlassify.zoom.setLevel(
                        zoomPercentageToLevel(zoomPercentage - 10),
                      )
                    }
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
                    label={t('settings.appearance.zoom_in')}
                    onClick={() =>
                      zoomPercentage < 120 &&
                      window.atlassify.zoom.setLevel(
                        zoomPercentageToLevel(zoomPercentage + 10),
                      )
                    }
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
                  onClick={() => window.atlassify.zoom.setLevel(0)}
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
