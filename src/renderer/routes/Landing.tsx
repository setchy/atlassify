import { type FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import type { IconProps, NewIconProps } from '@atlaskit/icon/types';

// Props handed to Button icon renderers (S6478-stable renderer below).
type ButtonIconProps =
  | Omit<IconProps, 'size'>
  | Omit<NewIconProps, 'spacing' | 'size'>;

import { AtlassianIcon } from '@atlaskit/logo/atlassian-icon';
import { BitbucketIcon } from '@atlaskit/logo/bitbucket/icon';
import { CompassIcon } from '@atlaskit/logo/compass/icon';
import { ConfluenceIcon } from '@atlaskit/logo/confluence/icon';
import { HomeIcon } from '@atlaskit/logo/home/icon';
import { JiraIcon } from '@atlaskit/logo/jira/icon';
import { JiraProductDiscoveryIcon } from '@atlaskit/logo/jira-product-discovery/icon';
import { JiraServiceManagementIcon } from '@atlaskit/logo/jira-service-management/icon';
import { RovoIcon } from '@atlaskit/logo/rovo/icon';
import { RovoDevIcon } from '@atlaskit/logo/rovo-dev/icon';
import { TeamsIcon } from '@atlaskit/logo/teams/icon';
import type { LogoProps } from '@atlaskit/logo/types';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { useAccountsStore } from '../stores';

import { AtlassifyIcon } from '../components/icons/AtlassifyIcon';
import { Centered } from '../components/layout/Centered';

import { showWindow } from '../utils/system/comms';

// Hoisted so its identity is stable across re-renders (S6478).
const LoginButtonIcon: FC<ButtonIconProps> = (iconProps) => (
  <AtlassianIcon {...iconProps} size="small" />
);

export const LandingRoute: FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const isLoggedIn = useAccountsStore((s) => s.isLoggedIn());

  useEffect(() => {
    if (isLoggedIn) {
      showWindow();
      navigate('/', { replace: true });
    }
  }, [isLoggedIn]);

  const commonLogoProps: LogoProps = {
    size: 'small',
    appearance: 'brand',
  };

  return (
    <Centered>
      <Stack alignBlock="center" alignInline="center" space="space.200">
        <AtlassifyIcon color="brand" size={64} />
        <Stack alignInline="center">
          <Heading size="large">
            Atlassian{' '}
            {t('landing.notifications', { defaultValue: 'notifications' })}
          </Heading>
          <Text size="large">
            {t('landing.subheading', { defaultValue: 'on your menu bar' })}
          </Text>
        </Stack>
        <Inline space="space.100">
          <JiraIcon {...commonLogoProps} />
          <ConfluenceIcon {...commonLogoProps} />
          <RovoIcon {...commonLogoProps} />
          <JiraProductDiscoveryIcon {...commonLogoProps} />
          <BitbucketIcon {...commonLogoProps} />
          <CompassIcon {...commonLogoProps} />
          <RovoDevIcon {...commonLogoProps} />
          <JiraServiceManagementIcon {...commonLogoProps} />
          <HomeIcon {...commonLogoProps} />
          <TeamsIcon {...commonLogoProps} />
        </Inline>
        <Tooltip
          content={t('landing.login.tooltip', {
            defaultValue: 'Login with Atlassian',
          })}
        >
          <Button
            appearance="primary"
            iconBefore={LoginButtonIcon}
            onClick={() => navigate('/login')}
            spacing="default"
            testId="login"
          >
            {t('landing.login.title', { defaultValue: 'Login' })}
          </Button>
        </Tooltip>
      </Stack>
    </Centered>
  );
};
