import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button, { IconButton } from '@atlaskit/button/new';
import { IconTile } from '@atlaskit/icon';
import CrossCircleIcon from '@atlaskit/icon/core/cross-circle';
import PeopleGroupIcon from '@atlaskit/icon/core/people-group';
import { Inline } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { APPLICATION } from '../../../shared/constants';
import { getAppVersion, quitApp } from '../../utils/comms';
import { openAtlassifyReleaseNotes } from '../../utils/links';
import { Footer } from '../primitives/Footer';

export const SettingsFooter: FC = () => {
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const result = await getAppVersion();
      setAppVersion(result);
    })();
  }, []);

  return (
    <Footer justify="space-between">
      <Tooltip
        content={t('settings.view_release_notes', {
          appName: APPLICATION.NAME,
        })}
        position="top"
      >
        <Button
          title={t('settings.view_release_notes', {
            appName: APPLICATION.NAME,
          })}
          appearance="subtle"
          onClick={() => openAtlassifyReleaseNotes(appVersion)}
          testId="settings-release-notes"
        >
          <span className="font-medium">
            {APPLICATION.NAME} {appVersion}
          </span>
        </Button>
      </Tooltip>

      <Inline space="space.200">
        <Tooltip content={t('settings.accounts')} position="top">
          <IconButton
            label={t('settings.accounts')}
            icon={() => (
              <IconTile
                icon={PeopleGroupIcon}
                label={t('settings.accounts')}
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
        <Tooltip
          content={t('sidebar.quit.tooltip', { appName: APPLICATION.NAME })}
          position="top"
        >
          <IconButton
            label={t('sidebar.quit.label', { appName: APPLICATION.NAME })}
            icon={() => (
              <IconTile
                icon={CrossCircleIcon}
                label={t('sidebar.quit.label', { appName: APPLICATION.NAME })}
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
