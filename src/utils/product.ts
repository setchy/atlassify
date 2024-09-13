import type { AtlassianNotification, AtlassianProduct } from './api/types';

import {
  AtlassianIcon,
  BitbucketIcon,
  CompassIcon,
  ConfluenceIcon,
  JiraIcon,
} from '@atlaskit/logo';

export function getAtlassianProduct(
  notification: AtlassianNotification,
): AtlassianProduct {
  const productName = notification.headNotification.analyticsAttributes.filter(
    (attribute) => attribute.key === 'registrationProduct',
  )[0].value;

  let productIcon: React.ComponentType;

  switch (productName) {
    case 'bitbucket':
      productIcon = BitbucketIcon;
      break;
    case 'compass':
      productIcon = CompassIcon;
      break;

    case 'confluence':
      productIcon = ConfluenceIcon;
      break;
    case 'jira':
      productIcon = JiraIcon;
      break;
    default:
      productIcon = AtlassianIcon;
  }

  return {
    name: productName,
    icon: productIcon,
  };
}
