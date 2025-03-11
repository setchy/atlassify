import { type FC, useContext, useState } from 'react';

import { IconButton, SplitButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import RetryIcon from '@atlaskit/icon/core/retry';
import ZoomInIcon from '@atlaskit/icon/core/zoom-in';
import ZoomOutIcon from '@atlaskit/icon/core/zoom-out';
import { Box, Inline, Stack, Text, xcss } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/dist/types/types';
// import { setGlobalTheme } from "@atlaskit/tokens";
import Tooltip from '@atlaskit/tooltip';

import { AppContext } from '../../context/App';
import { Theme } from '../../types';
// import { setTheme } from "../../utils/theme";
import { zoomLevelToPercentage, zoomPercentageToLevel } from '../../utils/zoom';

let zoomResizeTimeout: NodeJS.Timeout;
const ZOOM_RESIZE_DELAY = 200;

export const AppearanceSettings: FC = () => {
  const { settings, updateSetting } = useContext(AppContext);

  const [zoomPercentage, setZoomPercentage] = useState(
    zoomLevelToPercentage(window.atlassify.zoom.getLevel()),
  );

  const zoomBoxStyles = xcss({
    backgroundColor: 'color.background.accent.gray.subtlest',
  });

  /* istanbul ignore next - testing this is not important */
  // FIXME
  // useEffect(() => {
  // 	ipcRenderer.on(
  // 		namespacedEvent("update-theme"),
  // 		(_, updatedTheme: Theme) => {
  // 			if (settings.theme === Theme.SYSTEM) {
  // 				setTheme(updatedTheme);
  // 				setGlobalTheme({ colorMode: "auto" });
  // 			}
  // 		},
  // 	);
  // }, [settings.theme]);

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

  return (
    <Stack space="space.100">
      <Heading size="small">Appearance</Heading>

      <Box paddingInlineStart="space.050">
        <Inline space="space.100" alignBlock="start">
          <Text id="theme-label" weight="medium">
            Theme:
          </Text>
          <RadioGroup
            options={themeOptions}
            defaultValue={settings.theme}
            value={settings.theme}
            onChange={(evt) => {
              updateSetting('theme', evt.target.value as Theme);
            }}
            aria-labelledby="theme-label"
          />
        </Inline>
      </Box>

      <Box paddingInlineStart="space.050">
        <Inline space="space.100" alignBlock="center">
          <Text id="theme-label" weight="medium">
            Zoom:
          </Text>
          <Inline xcss={zoomBoxStyles}>
            <SplitButton spacing="compact">
              <Inline alignBlock="center">
                <Box paddingInline="space.150">
                  <Text>{zoomPercentage.toFixed(0)}%</Text>
                </Box>
                <Tooltip content="Zoom out" position="bottom">
                  <IconButton
                    label="Zoom out"
                    icon={ZoomOutIcon}
                    shape="circle"
                    spacing="compact"
                    onClick={() =>
                      zoomPercentage > 0 &&
                      window.atlassify.zoom.setLevel(
                        zoomPercentageToLevel(zoomPercentage - 10),
                      )
                    }
                    testId="settings-zoom-out"
                  />
                </Tooltip>
                <Tooltip content="Zoom in" position="bottom">
                  <IconButton
                    label="Zoom in"
                    icon={ZoomInIcon}
                    shape="circle"
                    spacing="compact"
                    onClick={() =>
                      zoomPercentage < 120 &&
                      window.atlassify.zoom.setLevel(
                        zoomPercentageToLevel(zoomPercentage + 10),
                      )
                    }
                    testId="settings-zoom-in"
                  />
                </Tooltip>
              </Inline>
              <Tooltip content="Reset zoom" position="bottom">
                <IconButton
                  label="Reset zoom"
                  icon={RetryIcon}
                  shape="circle"
                  spacing="compact"
                  onClick={() => window.atlassify.zoom.setLevel(0)}
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
