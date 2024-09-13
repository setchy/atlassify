import { type FC, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/buttons/Button';
import { AppContext } from '../context/App';
import { showWindow } from '../utils/comms';

import NotificationAllIcon from '@atlaskit/icon/glyph/notification-all';
import {
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  JiraIcon,
} from '@atlaskit/logo';

export const LoginRoute: FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AppContext);

  useEffect(() => {
    if (isLoggedIn) {
      showWindow();
      navigate('/', { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div>
        <AtlassianIcon appearance="brand" size="xlarge" />{' '}
        <NotificationAllIcon label="" size="xlarge" />
      </div>

      <div className="my-4 px-2.5 py-1.5 text-center font-semibold">
        <div>
          Atlassian Notifications <br /> on your menu bar.
        </div>
        <div className="flex items-center justify-center gap-2">
          <BitbucketIcon size="small" appearance="neutral" />
          <ConfluenceIcon size="small" appearance="neutral" />
          <CompassIcon size="small" appearance="neutral" />
          <JiraIcon size="small" appearance="neutral" />
        </div>
      </div>
      <Button
        name="Atlassian"
        label="Login with Atlassian"
        className="mt-2 py-2"
        onClick={() => navigate('/login-api-token')}
      >
        <AtlassianIcon appearance="neutral" size="small" /> Login
      </Button>
    </div>
  );
};
