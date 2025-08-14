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
  TrelloIcon,
} from '@atlaskit/logo';
import { Inline, Stack, Text } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

import { LogoIcon } from '../components/icons/LogoIcon';
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
        <LogoIcon width={64} height={64} />
        <Stack alignInline="center">
          <Heading size="large">Atlassian {t('landing.notifications')}</Heading>
          <Text size="large">{t('landing.subheading')}</Text>
        </Stack>
        <Inline space="space.100">
          <BitbucketIcon
            size="small"
            appearance="brand"
            shouldUseNewLogoDesign
          />
          <CompassIcon size="small" appearance="brand" shouldUseNewLogoDesign />
          <ConfluenceIcon
            size="small"
            appearance="brand"
            shouldUseNewLogoDesign
          />
          <JiraIcon size="small" appearance="brand" shouldUseNewLogoDesign />
          <JiraProductDiscoveryIcon
            size="small"
            appearance="brand"
            shouldUseNewLogoDesign
          />
          <JiraServiceManagementIcon
            size="small"
            appearance="brand"
            shouldUseNewLogoDesign
          />
          <HomeIcon size="small" appearance="brand" shouldUseNewLogoDesign />
          <TrelloIcon size="small" appearance="brand" shouldUseNewLogoDesign />
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
