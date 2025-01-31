import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button, { IconButton } from '@atlaskit/button/new';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import PeopleGroupIcon from '@atlaskit/icon/core/people-group';
import { Inline } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { IconTile } from '@atlaskit/icon';
import { APPLICATION } from '../../../shared/constants';
import { getAppVersion, quitApp } from '../../utils/comms';
import { openAtlassifyReleaseNotes } from '../../utils/links';
import { Footer } from '../primitives/Footer';

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
    <Footer justify="space-between">
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
            icon={() => (
              <IconTile
                icon={PeopleGroupIcon}
                label={'Accounts'}
                appearance="blue"
                shape="circle"
              />
            )}
            appearance="subtle"
            shape="circle"
            onClick={() => navigate('/accounts')}
            testId="settings-accounts"
          />
        </Tooltip>
        <Tooltip content={`Quit ${APPLICATION.NAME}`} position="top">
          <IconButton
            label={`Quit ${APPLICATION.NAME}`}
            icon={() => (
              <IconTile
                icon={CrossCircleIcon}
                label={`Quit ${APPLICATION.NAME}`}
                appearance="red"
                shape="circle"
              />
            )}
            appearance="subtle"
            shape="circle"
            onClick={() => quitApp()}
            testId="settings-quit"
          />
        </Tooltip>
      </Inline>
    </Footer>
  );
};
