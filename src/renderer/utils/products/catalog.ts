import {
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  HomeIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
  RovoIcon,
  TeamsIcon,
} from '@atlaskit/logo';

import i18n from '../../i18n';
import type { AtlassianProduct, ProductType } from '../../types';
import { URLs } from '../links';

export const PRODUCTS: Record<ProductType, AtlassianProduct> = {
  bitbucket: {
    type: 'bitbucket',
    display: 'Bitbucket',
    logo: BitbucketIcon,
    home: URLs.ATLASSIAN.WEB.BITBUCKET_HOME,
  },
  compass: {
    type: 'compass',
    display: 'Compass',
    logo: CompassIcon,
  },
  confluence: {
    type: 'confluence',
    display: 'Confluence',
    logo: ConfluenceIcon,
  },
  home: {
    type: 'home',
    display: 'Home',
    logo: HomeIcon,
  },
  jira: {
    type: 'jira',
    display: 'Jira',
    logo: JiraIcon,
  },
  jira_product_discovery: {
    type: 'jira_product_discovery',
    display: 'Jira Product Discovery',
    logo: JiraProductDiscoveryIcon,
  },
  jira_service_management: {
    type: 'jira_service_management',
    display: 'Jira Service Management',
    logo: JiraServiceManagementIcon,
  },
  rovo: {
    type: 'rovo',
    display: 'Rovo',
    logo: RovoIcon,
  },
  teams: {
    type: 'teams',
    display: 'Teams',
    logo: TeamsIcon,
  },
  unknown: {
    type: 'unknown',
    display: i18n.t('products.unknown'),
    logo: AtlassianIcon,
  },
};
