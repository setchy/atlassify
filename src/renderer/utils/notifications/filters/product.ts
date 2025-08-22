import {
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  HomeIcon,
  JiraIcon,
  JiraProductDiscoveryIcon,
  JiraServiceManagementIcon,
  TeamsIcon,
} from '@atlaskit/logo';

import i18n from '../../../i18n';
import type {
  AccountNotifications,
  AtlassifyNotification,
  ProductName,
  SettingsState,
} from '../../../types';
import type { Filter, FilterDetails } from './types';

// TODO remove duplication between this and utils/products PRODUCTS
export const PRODUCT_DETAILS: Record<ProductName, FilterDetails> = {
  bitbucket: {
    name: 'bitbucket',
    description: 'Bitbucket',
    logo: BitbucketIcon,
  },
  compass: {
    name: 'compass',
    description: 'Compass',
    logo: CompassIcon,
  },
  confluence: {
    name: 'confluence',
    description: 'Confluence',
    logo: ConfluenceIcon,
  },
  home: {
    name: 'home',
    description: 'Atlassian Home',
    logo: HomeIcon,
  },
  jira: {
    name: 'jira',
    description: 'Jira',
    logo: JiraIcon,
  },
  'jira product discovery': {
    name: 'jira product discovery',
    description: 'Jira Product Discovery',
    logo: JiraProductDiscoveryIcon,
  },
  'jira service management': {
    name: 'jira service management',
    description: 'Jira Service Management',
    logo: JiraServiceManagementIcon,
  },
  teams: {
    name: 'teams',
    description: 'Atlassian Teams',
    logo: TeamsIcon,
  },
  unknown: {
    name: 'unknown',
    description: i18n.t('filters.products.unknown'),
    logo: AtlassianIcon,
  },
};

export const productFilter: Filter<ProductName> = {
  FILTER_TYPES: PRODUCT_DETAILS,

  getTypeDetails(type: ProductName) {
    return this.FILTER_TYPES[type];
  },

  hasFilters(settings: SettingsState): boolean {
    return settings.filterProducts.length > 0;
  },

  isFilterSet(settings: SettingsState, product: ProductName): boolean {
    return settings.filterProducts.includes(product);
  },

  getFilterCount(notifications: AccountNotifications[], product: ProductName) {
    return notifications.reduce(
      (memo, acc) =>
        memo +
        acc.notifications.filter((n) => this.filterNotification(n, product))
          .length,
      0,
    );
  },

  filterNotification(
    notification: AtlassifyNotification,
    product: ProductName,
  ): boolean {
    return notification.product.name === product;
  },
};
