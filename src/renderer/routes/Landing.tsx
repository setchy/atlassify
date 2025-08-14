import { type FC, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import {
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  HomeIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
  type LogoProps,
  TrelloIcon,
} from '@atlaskit/logo';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { AtlassifyIcon } from '../components/icons/AtlassifyIcon';
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

  const commonLogoProps: LogoProps = {
    size: 'small',
    appearance: 'brand',
    shouldUseNewLogoDesign: true,
  };

  return (
    <Centered>
      <Stack alignBlock="center" alignInline="center" space="space.200">
        <AtlassifyIcon size={64} color="brand" />
        <Stack alignInline="center">
          <Heading size="large">Atlassian {t('landing.notifications')}</Heading>
          <Text size="large">{t('landing.subheading')}</Text>
        </Stack>
        <Inline space="space.100">
          <BitbucketIcon {...commonLogoProps} />
          <CompassIcon {...commonLogoProps} />
          <ConfluenceIcon {...commonLogoProps} />
          <JiraIcon {...commonLogoProps} />
          <JiraProductDiscoveryIcon {...commonLogoProps} />
          <JiraServiceManagementIcon {...commonLogoProps} />
          <HomeIcon {...commonLogoProps} />
          <TrelloIcon {...commonLogoProps} />
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
