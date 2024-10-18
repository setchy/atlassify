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
const documents = {
    "\n    query me {\n      me {\n        user {\n          accountId\n          name\n          picture\n        }\n      }\n    }\n  ": types.MeDocument,
    "\n    query myNotifications\n      (\n        $readState: InfluentsNotificationReadState, \n        $first: Int\n      ) \n      {\n      notifications {\n        unseenNotificationCount\n        notificationFeed(\n          flat: true, \n          first: $first,\n          filter: {\n            readStateFilter: $readState\n          }\n        ) {\n          pageInfo {\n            hasNextPage\n          }\n          nodes {\n            groupId\n            headNotification {\n              notificationId\n              timestamp\n              readState\n              category\n              content {\n                type\n                message\n                url\n                entity {\n                  title\n                  iconUrl\n                  url\n                }\n                path {\n                  title\n                  iconUrl\n                  url\n                }\n                actor {\n                  displayName\n                  avatarURL\n                }\n              }\n              analyticsAttributes {\n                key\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  ": types.MyNotificationsDocument,
    "\n    mutation markAsRead($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsRead(ids: $notificationIDs) \n      }\n    }\n  ": types.MarkAsReadDocument,
    "\n    mutation markAsUnread($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsUnread(ids: $notificationIDs) \n      }\n    }\n  ": types.MarkAsUnreadDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query me {\n      me {\n        user {\n          accountId\n          name\n          picture\n        }\n      }\n    }\n  "): typeof import('./graphql').MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query myNotifications\n      (\n        $readState: InfluentsNotificationReadState, \n        $first: Int\n      ) \n      {\n      notifications {\n        unseenNotificationCount\n        notificationFeed(\n          flat: true, \n          first: $first,\n          filter: {\n            readStateFilter: $readState\n          }\n        ) {\n          pageInfo {\n            hasNextPage\n          }\n          nodes {\n            groupId\n            headNotification {\n              notificationId\n              timestamp\n              readState\n              category\n              content {\n                type\n                message\n                url\n                entity {\n                  title\n                  iconUrl\n                  url\n                }\n                path {\n                  title\n                  iconUrl\n                  url\n                }\n                actor {\n                  displayName\n                  avatarURL\n                }\n              }\n              analyticsAttributes {\n                key\n                value\n              }\n            }\n          }\n        }\n      }\n    }\n  "): typeof import('./graphql').MyNotificationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation markAsRead($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsRead(ids: $notificationIDs) \n      }\n    }\n  "): typeof import('./graphql').MarkAsReadDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation markAsUnread($notificationIDs: [String!]!) {\n      notifications {\n        markNotificationsByIdsAsUnread(ids: $notificationIDs) \n      }\n    }\n  "): typeof import('./graphql').MarkAsUnreadDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
