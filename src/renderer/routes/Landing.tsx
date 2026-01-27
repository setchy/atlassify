import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  TeamsIcon,
} from '@atlaskit/logo';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { useAppContext } from '../hooks/useAppContext';
import { useLoggedNavigate } from '../hooks/useLoggedNavigate';

import { AtlassifyIcon } from '../components/icons/AtlassifyIcon';
import { Centered } from '../components/layout/Centered';

import { showWindow } from '../utils/comms';

export const LandingRoute: FC = () => {
  const navigate = useLoggedNavigate();

  const { isLoggedIn } = useAppContext();

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
        <AtlassifyIcon color="brand" size={64} />
        <Stack alignInline="center">
          <Heading size="large">Atlassian {t('landing.notifications')}</Heading>
          <Text size="large">{t('landing.subheading')}</Text>
        </Stack>
        <Inline space="space.100">
          <BitbucketIcon {...commonLogoProps} />
          <CompassIcon {...commonLogoProps} />
          <ConfluenceIcon {...commonLogoProps} />
          <HomeIcon {...commonLogoProps} />
          <JiraIcon {...commonLogoProps} />
          <JiraProductDiscoveryIcon {...commonLogoProps} />
          <JiraServiceManagementIcon {...commonLogoProps} />
          <TeamsIcon {...commonLogoProps} />
        </Inline>
        <Tooltip content={t('landing.login.tooltip')}>
          <Button
            appearance="primary"
            iconBefore={(iconProps) => (
              <AtlassianIcon {...iconProps} size="small" />
            )}
            onClick={() => navigate('/login')}
            spacing="default"
            testId="login"
          >
            {t('landing.login.title')}
          </Button>
        </Tooltip>
      </Stack>
    </Centered>
  );
};
