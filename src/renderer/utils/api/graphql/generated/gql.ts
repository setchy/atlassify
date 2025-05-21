/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query Me {\n      me {\n        user {\n          accountId\n          name\n          picture\n        }\n      }\n    }\n  ": typeof types.MeDocument,
    "\n    query MyNotifications\n      (\n        $readState: InfluentsNotificationReadState, \n        $flat: Boolean = true,\n        $first: Int\n      ) \n      {\n      notifications {\n        unseenNotificationCount\n        notificationFeed(\n          flat: $flat, \n          first: $first,\n          filter: {\n            readStateFilter: $readState\n          }\n        ) {\n          pageInfo {\n            hasNextPage\n          }\n          nodes {\n            ...AtlassianNotification\n          }\n        }\n      }\n    }\n  ": typeof types.MyNotificationsDocument,
    "\n    mutation MarkAsRead($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsRead(ids: $notificationIDs) \n      }\n    }\n  ": typeof types.MarkAsReadDocument,
    "\n    mutation MarkAsUnread($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsUnread(ids: $notificationIDs) \n      }\n    }\n  ": typeof types.MarkAsUnreadDocument,
    "\n    mutation MarkGroupAsRead($groupId: String!) {\n      notifications {\n        markNotificationsByGroupIdAsRead(groupId: $groupId) \n      }\n    }\n  ": typeof types.MarkGroupAsReadDocument,
    "\n    mutation MarkGroupAsUnread($groupId: String!) {\n      notifications {\n        markNotificationsByGroupIdAsUnread(groupId: $groupId) \n      }\n    }\n  ": typeof types.MarkGroupAsUnreadDocument,
    "\n    fragment AtlassianNotification on InfluentsNotificationHeadItem {\n      groupId\n      groupSize\n      additionalActors {\n        displayName\n        avatarURL\n      }\n      headNotification {\n        ...AtlassianHeadNotification\n      }\n    }\n  ": typeof types.AtlassianNotificationFragmentDoc,
    "\n    fragment AtlassianHeadNotification on InfluentsNotificationItem {\n      notificationId\n      timestamp\n      readState\n      category\n      content {\n        type\n        message\n        url\n        entity {\n          title\n          iconUrl\n          url\n        }\n        path {\n          title\n          iconUrl\n          url\n        }\n        actor {\n          displayName\n          avatarURL\n        }\n      }\n      analyticsAttributes {\n        key\n        value\n      }\n    }\n  ": typeof types.AtlassianHeadNotificationFragmentDoc,
};
const documents: Documents = {
    "\n    query Me {\n      me {\n        user {\n          accountId\n          name\n          picture\n        }\n      }\n    }\n  ": types.MeDocument,
    "\n    query MyNotifications\n      (\n        $readState: InfluentsNotificationReadState, \n        $flat: Boolean = true,\n        $first: Int\n      ) \n      {\n      notifications {\n        unseenNotificationCount\n        notificationFeed(\n          flat: $flat, \n          first: $first,\n          filter: {\n            readStateFilter: $readState\n          }\n        ) {\n          pageInfo {\n            hasNextPage\n          }\n          nodes {\n            ...AtlassianNotification\n          }\n        }\n      }\n    }\n  ": types.MyNotificationsDocument,
    "\n    mutation MarkAsRead($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsRead(ids: $notificationIDs) \n      }\n    }\n  ": types.MarkAsReadDocument,
    "\n    mutation MarkAsUnread($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsUnread(ids: $notificationIDs) \n      }\n    }\n  ": types.MarkAsUnreadDocument,
    "\n    mutation MarkGroupAsRead($groupId: String!) {\n      notifications {\n        markNotificationsByGroupIdAsRead(groupId: $groupId) \n      }\n    }\n  ": types.MarkGroupAsReadDocument,
    "\n    mutation MarkGroupAsUnread($groupId: String!) {\n      notifications {\n        markNotificationsByGroupIdAsUnread(groupId: $groupId) \n      }\n    }\n  ": types.MarkGroupAsUnreadDocument,
    "\n    fragment AtlassianNotification on InfluentsNotificationHeadItem {\n      groupId\n      groupSize\n      additionalActors {\n        displayName\n        avatarURL\n      }\n      headNotification {\n        ...AtlassianHeadNotification\n      }\n    }\n  ": types.AtlassianNotificationFragmentDoc,
    "\n    fragment AtlassianHeadNotification on InfluentsNotificationItem {\n      notificationId\n      timestamp\n      readState\n      category\n      content {\n        type\n        message\n        url\n        entity {\n          title\n          iconUrl\n          url\n        }\n        path {\n          title\n          iconUrl\n          url\n        }\n        actor {\n          displayName\n          avatarURL\n        }\n      }\n      analyticsAttributes {\n        key\n        value\n      }\n    }\n  ": types.AtlassianHeadNotificationFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Me {\n      me {\n        user {\n          accountId\n          name\n          picture\n        }\n      }\n    }\n  "): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query MyNotifications\n      (\n        $readState: InfluentsNotificationReadState, \n        $flat: Boolean = true,\n        $first: Int\n      ) \n      {\n      notifications {\n        unseenNotificationCount\n        notificationFeed(\n          flat: $flat, \n          first: $first,\n          filter: {\n            readStateFilter: $readState\n          }\n        ) {\n          pageInfo {\n            hasNextPage\n          }\n          nodes {\n            ...AtlassianNotification\n          }\n        }\n      }\n    }\n  "): typeof import('./graphql').MyNotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation MarkAsRead($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsRead(ids: $notificationIDs) \n      }\n    }\n  "): typeof import('./graphql').MarkAsReadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation MarkAsUnread($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsUnread(ids: $notificationIDs) \n      }\n    }\n  "): typeof import('./graphql').MarkAsUnreadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation MarkGroupAsRead($groupId: String!) {\n      notifications {\n        markNotificationsByGroupIdAsRead(groupId: $groupId) \n      }\n    }\n  "): typeof import('./graphql').MarkGroupAsReadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation MarkGroupAsUnread($groupId: String!) {\n      notifications {\n        markNotificationsByGroupIdAsUnread(groupId: $groupId) \n      }\n    }\n  "): typeof import('./graphql').MarkGroupAsUnreadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment AtlassianNotification on InfluentsNotificationHeadItem {\n      groupId\n      groupSize\n      additionalActors {\n        displayName\n        avatarURL\n      }\n      headNotification {\n        ...AtlassianHeadNotification\n      }\n    }\n  "): typeof import('./graphql').AtlassianNotificationFragmentDoc;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment AtlassianHeadNotification on InfluentsNotificationItem {\n      notificationId\n      timestamp\n      readState\n      category\n      content {\n        type\n        message\n        url\n        entity {\n          title\n          iconUrl\n          url\n        }\n        path {\n          title\n          iconUrl\n          url\n        }\n        actor {\n          displayName\n          avatarURL\n        }\n      }\n      analyticsAttributes {\n        key\n        value\n      }\n    }\n  "): typeof import('./graphql').AtlassianHeadNotificationFragmentDoc;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
