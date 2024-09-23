import type { Link } from '../../types';

export interface GraphQLResponse<T, U> {
  data: T;
  extensions: U;
  errors?: AtlassianGraphQLAPIError[];
}

export interface GraphQLRequest {
  query: string;
  variables: Record<string, unknown>;
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
      pageInfo: {
        hasNextPage: boolean;
      };
      nodes: AtlassianNotification[];
    };
  };
}

export interface NotificationsExtensions {
  notifications: {
    response_info: {
      responseSize: number;
    };
  };
}

export type Category = 'direct' | 'watching';

export type ReadState = 'unread' | 'read';

export interface AtlassianNotification {
  groupId: string;
  headNotification: AtlassianHeadNotification;
}

export interface AtlassianHeadNotification {
  notificationId: string;
  timestamp: string;
  readState: ReadState;
  category: Category;
  content: {
    type: string;
    message: string;
    url: Link;
    path: {
      title: string;
      url: Link;
      iconUrl: Link | null;
    }[];
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
  analyticsAttributes: {
    key: string;
    value: string;
  }[];
}

export type AtlassianAPIError =
  | AtlassianHTTPError
  | AtlassianAuthError
  | AtlassianGraphQLAPIErrors;

export interface AtlassianAuthError {
  code: number;
  message: string;
}

export interface AtlassianHTTPError {
  status: number;
  message: string;
}

export interface AtlassianGraphQLAPIErrors {
  errors: AtlassianGraphQLAPIError[];
}

export interface AtlassianGraphQLAPIError {
  message: string;
  extensions: {
    classification: string;
    errorType: string;
    statusCode: number;
  };
}
