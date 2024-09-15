import { ipcRenderer, webFrame } from 'electron';
import { type FC, useContext, useEffect, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import MediaServicesZoomInIcon from '@atlaskit/icon/glyph/media-services/zoom-in';
import MediaServicesZoomOutIcon from '@atlaskit/icon/glyph/media-services/zoom-out';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/types';

import Heading from '@atlaskit/heading';
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

  useEffect(() => {
    ipcRenderer.on('atlasify:update-theme', (_, updatedTheme: Theme) => {
      if (settings.theme === Theme.SYSTEM) {
        setTheme(updatedTheme);
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

  const themeOptions: OptionsPropType = [
    { name: 'theme', label: 'System', value: Theme.SYSTEM },
    { name: 'theme', label: 'Light', value: Theme.LIGHT },
    { name: 'theme', label: 'Dark', value: Theme.DARK },
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
          defaultValue={settings.theme}
          value={settings.theme}
          isDisabled={true}
          onChange={(evt) => {
            updateSetting('theme', evt.target.value as Theme);
          }}
          aria-labelledby="theme-label"
        />
      </Inline>

      <div className="flex items-center mt-3 mb-2 text-sm">
        <label
          htmlFor="Zoom"
          className="mr-3 content-center font-medium text-gray-700 dark:text-gray-200"
        >
          Zoom:
        </label>
        <IconButton
          icon={MediaServicesZoomOutIcon}
          label="Zoom Out"
          shape="circle"
          spacing="compact"
          onClick={() =>
            zoomPercentage > 0 &&
            webFrame.setZoomLevel(zoomPercentageToLevel(zoomPercentage - 10))
          }
        />
        <span className="flex w-16 h-5 items-center justify-center rounded-none border border-gray-300 bg-transparent text-xs text-gray-700 dark:text-gray-200">
          {zoomPercentage.toFixed(0)}%
        </span>
        <IconButton
          icon={MediaServicesZoomInIcon}
          label="Zoom In"
          shape="circle"
          spacing="compact"
          onClick={() =>
            zoomPercentage < 120 &&
            webFrame.setZoomLevel(zoomPercentageToLevel(zoomPercentage + 10))
          }
        />
        <IconButton
          icon={SelectClearIcon}
          label="Reset Zoom"
          shape="circle"
          spacing="compact"
          onClick={() => webFrame.setZoomLevel(0)}
        />
      </div>
    </Stack>
  );
};
