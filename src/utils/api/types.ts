import type { Link } from '../../types';

export interface AtlassianProduct {
  name: Product;
  description: string;
  icon: React.ComponentType;
}

export interface BasicDetails {
  name: string;
  description: string;
}

export interface MyUserDetails {
  me: {
    user: {
      accountId: string;
      name: string;
      picture: Link;
    };
  };
}

export interface MyNotifications {
  notifications: {
    unseenNotificationCount: number;
    notificationFeed: {
      nodes: AtlassianNotification[];
    };
  };
}

export type Category = 'direct' | 'watching';

export type ReadState = 'unread' | 'read';

export type Product =
  | 'bitbucket'
  | 'confluence'
  | 'compass'
  | 'jira'
  | 'jira product discovery'
  | 'jira service management'
  | 'unknown';

export interface AtlassianNotification {
  groupId: string;
  headNotification: {
    notificationId: string;
    timestamp: string;
    readState: string;
    category: string;
    content: {
      type: string;
      message: string;
      url: Link;
      path: [
        {
          title: string;
          url: Link;
          iconUrl: Link | null;
        },
      ];
      entity: {
        title: string;
        iconUrl: Link;
        url: Link;
      };
      actor: {
        displayName: string;
        avatarURL: Link;
      };
    };
    analyticsAttributes: [
      {
        key: string;
        value: string;
      },
    ];
  };
}

export interface GraphQLResponse<T> {
  data: T;
}

export type AtlassianAPIError =
  | AtlassianHTTPError
  | AtlassianAuthError
  | AtlassianGraphQLAPIError;

export interface AtlassianAuthError {
  code: number;
  message: string;
}

export interface AtlassianHTTPError {
  status: number;
  message: string;
}

export interface AtlassianGraphQLAPIError {
  errors: {
    message: string;
    extensions: {
      classification: string;
      errorType: string;
      statusCode: number;
    };
  }[];
}
