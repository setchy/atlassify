import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import PeopleGroupIcon from '@atlaskit/icon/glyph/people-group';
import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUTTON_CLASS_NAME } from '../../styles/atlasify';
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
    <div className="flex items-center justify-between bg-gray-200 px-8 py-1 text-sm dark:bg-gray-darker">
      <button
        type="button"
        className="cursor-pointer font-semibold"
        title="View release notes"
        onClick={() => openAtlasifyReleaseNotes(appVersion)}
      >
        <div className="flex items-center gap-1">
          <span aria-label="app-version">Atlasify {appVersion}</span>
        </div>
      </button>
      <div>
        <button
          type="button"
          className={BUTTON_CLASS_NAME}
          title="Accounts"
          onClick={() => {
            navigate('/accounts');
          }}
        >
          <PeopleGroupIcon size="medium" label="Accounts" />
        </button>

        <button
          type="button"
          className={BUTTON_CLASS_NAME}
          title="Quit Atlasify"
          onClick={quitApp}
        >
          <CrossCircleIcon size="medium" label="Quit Atlasify" />
        </button>
      </div>
    </div>
  );
};
