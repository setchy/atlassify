import { type FC, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';
import NotificationAllIcon from '@atlaskit/icon/glyph/notification-all';
import {
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
} from '@atlaskit/logo';

import { AppContext } from '../context/App';
import { showWindow } from '../utils/comms';

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
          <JiraProductDiscoveryIcon size="small" appearance="neutral" />
          <JiraServiceManagementIcon size="small" appearance="neutral" />
        </div>
      </div>

      <Tooltip content="Login with Atlassian">
        <Button
          appearance="primary"
          spacing="default"
          iconBefore={(iconProps) => (
            <AtlassianIcon {...iconProps} size="small" />
          )}
          onClick={() => navigate('/login-api-token')}
        >
          Login
        </Button>
      </Tooltip>
    </div>
  );
};
