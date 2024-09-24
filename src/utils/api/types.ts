import type { Link } from '../../types';

export interface GraphQLResponse<T, U> {
  data: T;
  extensions: U;
  errors?: GraphQLAPIError[];
}

export interface GraphQLRequest {
  query: string;
  variables: Record<string, unknown>;
}

export interface GraphQLAPIError {
  message: string;
  extensions: {
    classification: string;
    errorType: string;
    statusCode: number;
  };
}

export interface NotificationsExtensions {
  notifications: {
    response_info: {
      responseSize: number;
    };
  };
}

/**
 * The notification category.
 *
 * - `direct` - A direct notification event.
 * - `watching` - A watched notification event.
 */
export type Category = 'direct' | 'watching';

/**
 * The read state of the notification.
 *
 * - `unread` - The notification has not been read.
 * - `read` - The notification has been read.
 */
export type ReadState = 'unread' | 'read';

/**
 * Response shape for the `me` query.
 */
export interface MyUserDetails {
  me: {
    user: {
      accountId: string;
      name: string;
      picture: Link;
    };
  };
}

/**
 * Response shape for the `notifications` query.
 */
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

export interface AtlassianNotification {
  groupId: string;
  headNotification: AtlassianHeadNotification;
}

/**
 * An Atlassian Notification record.
 */
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
      url: Link;
      iconUrl: Link;
    };
    /**
     * The actor who triggered the notification.
     */
    actor: {
      displayName: string;
      avatarURL: Link;
    };
  };
  /**
   * An array of key-value pairs that represent the analytics attributes of the notification.
   */
  analyticsAttributes: {
    key: string;
    value: string;
  }[];
}

/**
 * The different types of API errors which may be encountered.
 */
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
  errors: GraphQLAPIError[];
}
