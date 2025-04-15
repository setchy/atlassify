import { type FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import {
  AtlasIcon,
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
  TrelloIcon,
} from '@atlaskit/logo';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { Centered } from '../components/layout/Centered';
import { AppContext } from '../context/App';
import { showWindow } from '../utils/comms';

export const LandingRoute: FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AppContext);

  const { t } = useTranslation();

  useEffect(() => {
    if (isLoggedIn) {
      showWindow();
      navigate('/', { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <Centered>
      <Stack alignBlock="center" alignInline="center" space="space.200">
        <AtlasIcon appearance="brand" size="xlarge" />
        <Stack alignInline="center">
          <Heading size="large">Atlassian {t('common.notifications')}</Heading>
          <Text size="large">{t('landing.subheading')}</Text>
        </Stack>
        <Inline space="space.100">
          <BitbucketIcon size="small" appearance="neutral" />
          <CompassIcon size="small" appearance="neutral" />
          <ConfluenceIcon size="small" appearance="neutral" />
          <JiraIcon size="small" appearance="neutral" />
          <JiraProductDiscoveryIcon size="small" appearance="neutral" />
          <JiraServiceManagementIcon size="small" appearance="neutral" />
          <TrelloIcon size="small" appearance="neutral" />
        </Inline>
        <Tooltip content={t('landing.login.tooltip')}>
          <Button
            appearance="primary"
            spacing="default"
            iconBefore={(iconProps) => (
              <AtlassianIcon {...iconProps} size="small" />
            )}
            onClick={() => navigate('/login')}
            testId="login"
          >
            {t('landing.login.title')}
          </Button>
        </Tooltip>
      </Stack>
    </Centered>
  );
};
