import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import PeopleGroupIcon from '@atlaskit/icon/glyph/people-group';
import { Box, Inline, Stack } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { APPLICATION } from '../../../shared/constants';
import { getAppVersion, quitApp } from '../../utils/comms';
import { openAtlassifyReleaseNotes } from '../../utils/links';

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
    <Box
      padding="space.050"
      backgroundColor="color.background.accent.gray.subtlest"
    >
      <Stack>
        <Inline grow="fill" spread="space-between">
          <Tooltip
            content={`View ${APPLICATION.NAME} release notes`}
            position="top"
          >
            <Button
              title={`View ${APPLICATION.NAME} release notes`}
              appearance="subtle"
              onClick={() => openAtlassifyReleaseNotes(appVersion)}
              testId="settings-release-notes"
            >
              {APPLICATION.NAME} {appVersion}
            </Button>
          </Tooltip>

          <Inline space="space.200">
            <Tooltip content="Accounts" position="top">
              <IconButton
                label="Accounts"
                icon={PeopleGroupIcon}
                appearance="subtle"
                shape="circle"
                onClick={() => navigate('/accounts')}
                testId="settings-accounts"
              />
            </Tooltip>
            <Tooltip content={`Quit ${APPLICATION.NAME}`} position="top">
              <IconButton
                label={`Quit ${APPLICATION.NAME}`}
                icon={CrossCircleIcon}
                appearance="subtle"
                shape="circle"
                onClick={() => quitApp()}
                testId="settings-quit"
              />
            </Tooltip>
          </Inline>
        </Inline>
      </Stack>
    </Box>
  );
};
