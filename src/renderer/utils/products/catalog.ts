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

import type { AtlassianProduct, ProductType } from '../../types';

import { URLs } from '../system/links';

export const PRODUCTS: Record<ProductType, AtlassianProduct> = {
  atlassian: {
    type: 'atlassian',
    display: 'Atlassian',
    logo: AtlassianIcon,
  },
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
    display: 'Rovo Chat',
    logo: RovoIcon,
  },
  rovo_dev: {
    type: 'rovo_dev',
    display: 'Rovo Dev',
    logo: RovoDevIcon,
  },
  teams: {
    type: 'teams',
    display: 'Teams',
    logo: TeamsIcon,
  },
};
