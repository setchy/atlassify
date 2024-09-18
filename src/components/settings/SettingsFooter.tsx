import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import PeopleGroupIcon from '@atlaskit/icon/glyph/people-group';

import { Box, Inline, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';
import { getAppVersion, quitApp } from '../../utils/comms';
import { openAtlasifyReleaseNotes } from '../../utils/links';

export const SettingsFooter: FC = () => {
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (process.env.NODE_ENV === 'development') {
        setAppVersion('dev');
      } else {
        const result = await getAppVersion();
        setAppVersion(`v${result}`);
      }
    })();
  }, []);

  return (
    <div className="text-sm  px-2 bg-gray-200 dark:bg-gray-darker">
      <Box padding="space.050">
        <Stack>
          <Inline grow="fill" spread="space-between">
            <Tooltip content="View Atlasify release notes" position="top">
              <Button
                title="View Atlasify release notes"
                appearance="subtle"
                onClick={() => openAtlasifyReleaseNotes(appVersion)}
              >
                Atlasify {appVersion}
              </Button>
            </Tooltip>

            <Inline space="space.200">
              <Tooltip content="Accounts" position="top">
                <IconButton
                  label="Accounts"
                  title="Accounts"
                  icon={PeopleGroupIcon}
                  appearance="subtle"
                  shape="circle"
                  onClick={() => navigate('/accounts')}
                />
              </Tooltip>
              <Tooltip content="Quit Atlasify" position="top">
                <IconButton
                  label="Quit Atlasify"
                  title="Quit Atlasify"
                  icon={CrossCircleIcon}
                  appearance="subtle"
                  shape="circle"
                  onClick={() => quitApp()}
                />
              </Tooltip>
            </Inline>
          </Inline>
        </Stack>
      </Box>
    </div>
  );
};
