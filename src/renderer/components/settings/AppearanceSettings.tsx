import { ipcRenderer, webFrame } from 'electron';
import { type FC, useContext, useEffect, useState } from 'react';

import Badge from '@atlaskit/badge';
import { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import MediaServicesZoomInIcon from '@atlaskit/icon/glyph/media-services/zoom-in';
import MediaServicesZoomOutIcon from '@atlaskit/icon/glyph/media-services/zoom-out';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/dist/types/types';
import { setGlobalTheme, token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';
import { Theme } from '../../types';
import { setTheme } from '../../utils/theme';
import { zoomLevelToPercentage, zoomPercentageToLevel } from '../../utils/zoom';

let timeout: NodeJS.Timeout;
const DELAY = 200;

export const AppearanceSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);
  const [zoomPercentage, setZoomPercentage] = useState(
    zoomLevelToPercentage(webFrame.getZoomLevel()),
  );

  /* istanbul ignore next - testing this is not important */
  useEffect(() => {
    ipcRenderer.on('atlassify:update-theme', (_, updatedTheme: Theme) => {
      if (settings.theme === Theme.SYSTEM) {
        setTheme(updatedTheme);
        setGlobalTheme({ colorMode: 'auto' });
      }
    });
  }, [settings.theme]);

  window.addEventListener('resize', () => {
    // clear the timeout
    clearTimeout(timeout);
    // start timing for event "completion"
    timeout = setTimeout(() => {
      const zoomPercentage = zoomLevelToPercentage(webFrame.getZoomLevel());
      setZoomPercentage(zoomPercentage);
      updateSetting('zoomPercentage', zoomPercentage);
    }, DELAY);
  });

  /**
   * TODO: support theme selection #92
   */
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

  return (
    <Stack space="space.100">
      <Heading size="small">Appearance</Heading>

      <Inline space="space.100">
        <Text id="theme-label" weight="medium">
          Theme:
        </Text>
        <RadioGroup
          options={themeOptions}
          // defaultValue={settings.theme}
          defaultValue="LIGHT"
          isDisabled={true}
          value={settings.theme}
          onChange={(evt) => {
            updateSetting('theme', evt.target.value as Theme);
          }}
          aria-labelledby="theme-label"
        />
      </Inline>

      <Inline space="space.100">
        <Text id="theme-label" weight="medium">
          Zoom:
        </Text>
        <Inline alignBlock="center">
          <Tooltip content="Zoom Out" position="bottom">
            <IconButton
              label="Zoom Out"
              icon={MediaServicesZoomOutIcon}
              shape="circle"
              spacing="compact"
              onClick={() =>
                zoomPercentage > 0 &&
                webFrame.setZoomLevel(
                  zoomPercentageToLevel(zoomPercentage - 10),
                )
              }
              testId="settings-zoom-out"
            />
          </Tooltip>
          <Badge max={false}>{zoomPercentage.toFixed(0)}%</Badge>
          <Tooltip content="Zoom In" position="bottom">
            <IconButton
              label="Zoom In"
              icon={MediaServicesZoomInIcon}
              shape="circle"
              spacing="compact"
              onClick={() =>
                zoomPercentage < 120 &&
                webFrame.setZoomLevel(
                  zoomPercentageToLevel(zoomPercentage + 10),
                )
              }
              testId="settings-zoom-in"
            />
          </Tooltip>
          <Tooltip content="Reset Zoom" position="bottom">
            <IconButton
              label="Reset Zoom"
              icon={(iconProps) => (
                <SelectClearIcon
                  {...iconProps}
                  primaryColor={token('color.icon.accent.red')}
                />
              )}
              shape="circle"
              spacing="compact"
              onClick={() => webFrame.setZoomLevel(0)}
              testId="settings-zoom-reset"
            />
          </Tooltip>
        </Inline>
      </Inline>
    </Stack>
  );
};
