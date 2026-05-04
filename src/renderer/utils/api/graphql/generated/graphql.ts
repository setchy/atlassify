/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { Link } from '../../../../types';
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export enum InfluentsNotificationCategory {
  Direct = 'direct',
  Watching = 'watching'
}

export enum InfluentsNotificationReadState {
  Read = 'read',
  Unread = 'unread'
}

/** Jira Project types. */
export enum JiraProjectType {
  /** A business project. */
  Business = 'BUSINESS',
  /** A customer service project. */
  CustomerService = 'CUSTOMER_SERVICE',
  /** A product discovery project. */
  ProductDiscovery = 'PRODUCT_DISCOVERY',
  /** A service desk project. */
  ServiceDesk = 'SERVICE_DESK',
  /** A software project. */
  Software = 'SOFTWARE'
}

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { user:
      | { accountId: string, name: string, picture: Link }
      | { accountId: string, name: string, picture: Link }
      | { accountId: string, name: string, picture: Link }
     | null } };

export type MarkAsReadMutationVariables = Exact<{
  notificationIDs: Array<string> | string;
}>;


export type MarkAsReadMutation = { notifications: { markNotificationsByIdsAsRead: string | null } | null };

export type MarkAsUnreadMutationVariables = Exact<{
  notificationIDs: Array<string> | string;
}>;


export type MarkAsUnreadMutation = { notifications: { markNotificationsByIdsAsUnread: string | null } | null };

export type RetrieveNotificationsByGroupIdQueryVariables = Exact<{
  groupId: string;
  first?: number | null | undefined;
  readState?: InfluentsNotificationReadState | null | undefined;
}>;


export type RetrieveNotificationsByGroupIdQuery = { notifications: { notificationGroup: { nodes: Array<{ notificationId: string, readState: InfluentsNotificationReadState }> } } | null };

export type GroupNotificationDetailsFragment = { notificationId: string, readState: InfluentsNotificationReadState };

export type MyNotificationsQueryVariables = Exact<{
  readState?: InfluentsNotificationReadState | null | undefined;
  flat?: boolean | null | undefined;
  first?: number | null | undefined;
}>;


export type MyNotificationsQuery = { notifications: { unseenNotificationCount: number, notificationFeed: { pageInfo: { hasNextPage: boolean }, nodes: Array<{ groupId: string, groupSize: number, additionalActors: Array<{ displayName: string | null, avatarURL: string | null }>, headNotification: { notificationId: string, timestamp: string, readState: InfluentsNotificationReadState, category: InfluentsNotificationCategory, content: { type: string, message: string, url: string | null, entity: { title: string | null, iconUrl: string | null, url: string | null } | null, path: Array<{ title: string | null, iconUrl: string | null, url: string | null }> | null, actor: { displayName: string | null, avatarURL: string | null } }, analyticsAttributes: Array<{ key: string | null, value: string | null }> | null } }> } } | null };

export type AtlassianNotificationFragment = { groupId: string, groupSize: number, additionalActors: Array<{ displayName: string | null, avatarURL: string | null }>, headNotification: { notificationId: string, timestamp: string, readState: InfluentsNotificationReadState, category: InfluentsNotificationCategory, content: { type: string, message: string, url: string | null, entity: { title: string | null, iconUrl: string | null, url: string | null } | null, path: Array<{ title: string | null, iconUrl: string | null, url: string | null }> | null, actor: { displayName: string | null, avatarURL: string | null } }, analyticsAttributes: Array<{ key: string | null, value: string | null }> | null } };

export type AtlassianHeadNotificationFragment = { notificationId: string, timestamp: string, readState: InfluentsNotificationReadState, category: InfluentsNotificationCategory, content: { type: string, message: string, url: string | null, entity: { title: string | null, iconUrl: string | null, url: string | null } | null, path: Array<{ title: string | null, iconUrl: string | null, url: string | null }> | null, actor: { displayName: string | null, avatarURL: string | null } }, analyticsAttributes: Array<{ key: string | null, value: string | null }> | null };

export type RetrieveCloudIDsForHostnamesQueryVariables = Exact<{
  hostNames: Array<string> | string;
}>;


export type RetrieveCloudIDsForHostnamesQuery = { tenantContexts: Array<{ cloudId: string | null, hostName: string | null } | null> | null };

export type MarkGroupAsReadMutationVariables = Exact<{
  groupId: string;
}>;


export type MarkGroupAsReadMutation = { notifications: { markNotificationsByGroupIdAsRead: string | null } | null };

export type MarkGroupAsUnreadMutationVariables = Exact<{
  groupId: string;
}>;


export type MarkGroupAsUnreadMutation = { notifications: { markNotificationsByGroupIdAsUnread: string | null } | null };

export type RetrieveJiraProjectTypesQueryVariables = Exact<{
  cloudId: string | number;
  keys: Array<string> | string;
}>;


export type RetrieveJiraProjectTypesQuery = { jira: { issuesByKey: Array<{ key: string, summary: string | null, projectField: { project: { name: string, projectTypeName: string | null, projectType: JiraProjectType | null } | null } | null } | null> | null } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const GroupNotificationDetailsFragmentDoc = new TypedDocumentString(`
    fragment GroupNotificationDetails on InfluentsNotificationItem {
  notificationId
  readState
}
    `, {"fragmentName":"GroupNotificationDetails"}) as unknown as TypedDocumentString<GroupNotificationDetailsFragment, unknown>;
export const AtlassianHeadNotificationFragmentDoc = new TypedDocumentString(`
    fragment AtlassianHeadNotification on InfluentsNotificationItem {
  notificationId
  timestamp
  readState
  category
  content {
    type
    message
    url
    entity {
      title
      iconUrl
      url
    }
    path {
      title
      iconUrl
      url
    }
    actor {
      displayName
      avatarURL
    }
  }
  analyticsAttributes {
    key
    value
  }
}
    `, {"fragmentName":"AtlassianHeadNotification"}) as unknown as TypedDocumentString<AtlassianHeadNotificationFragment, unknown>;
export const AtlassianNotificationFragmentDoc = new TypedDocumentString(`
    fragment AtlassianNotification on InfluentsNotificationHeadItem {
  groupId
  groupSize
  additionalActors {
    displayName
    avatarURL
  }
  headNotification {
    ...AtlassianHeadNotification
  }
}
    fragment AtlassianHeadNotification on InfluentsNotificationItem {
  notificationId
  timestamp
  readState
  category
  content {
    type
    message
    url
    entity {
      title
      iconUrl
      url
    }
    path {
      title
      iconUrl
      url
    }
    actor {
      displayName
      avatarURL
    }
  }
  analyticsAttributes {
    key
    value
  }
}`, {"fragmentName":"AtlassianNotification"}) as unknown as TypedDocumentString<AtlassianNotificationFragment, unknown>;
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    user {
      accountId
      name
      picture
    }
  }
}
    `) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const MarkAsReadDocument = new TypedDocumentString(`
    mutation MarkAsRead($notificationIDs: [String!]!) {
  notifications {
    markNotificationsByIdsAsRead(ids: $notificationIDs)
  }
}
    `) as unknown as TypedDocumentString<MarkAsReadMutation, MarkAsReadMutationVariables>;
export const MarkAsUnreadDocument = new TypedDocumentString(`
    mutation MarkAsUnread($notificationIDs: [String!]!) {
  notifications {
    markNotificationsByIdsAsUnread(ids: $notificationIDs)
  }
}
    `) as unknown as TypedDocumentString<MarkAsUnreadMutation, MarkAsUnreadMutationVariables>;
export const RetrieveNotificationsByGroupIdDocument = new TypedDocumentString(`
    query RetrieveNotificationsByGroupId($groupId: String!, $first: Int, $readState: InfluentsNotificationReadState) {
  notifications {
    notificationGroup(
      groupId: $groupId
      first: $first
      filter: {readStateFilter: $readState}
    ) {
      nodes {
        ...GroupNotificationDetails
      }
    }
  }
}
    fragment GroupNotificationDetails on InfluentsNotificationItem {
  notificationId
  readState
}`) as unknown as TypedDocumentString<RetrieveNotificationsByGroupIdQuery, RetrieveNotificationsByGroupIdQueryVariables>;
export const MyNotificationsDocument = new TypedDocumentString(`
    query MyNotifications($readState: InfluentsNotificationReadState, $flat: Boolean = true, $first: Int) {
  notifications {
    unseenNotificationCount
    notificationFeed(
      flat: $flat
      first: $first
      filter: {readStateFilter: $readState}
    ) {
      pageInfo {
        hasNextPage
      }
      nodes {
        ...AtlassianNotification
      }
    }
  }
}
    fragment AtlassianNotification on InfluentsNotificationHeadItem {
  groupId
  groupSize
  additionalActors {
    displayName
    avatarURL
  }
  headNotification {
    ...AtlassianHeadNotification
  }
}
fragment AtlassianHeadNotification on InfluentsNotificationItem {
  notificationId
  timestamp
  readState
  category
  content {
    type
    message
    url
    entity {
      title
      iconUrl
      url
    }
    path {
      title
      iconUrl
      url
    }
    actor {
      displayName
      avatarURL
    }
  }
  analyticsAttributes {
    key
    value
  }
}`) as unknown as TypedDocumentString<MyNotificationsQuery, MyNotificationsQueryVariables>;
export const RetrieveCloudIDsForHostnamesDocument = new TypedDocumentString(`
    query RetrieveCloudIDsForHostnames($hostNames: [String!]!) {
  tenantContexts(hostNames: $hostNames) {
    cloudId
    hostName
  }
}
    `) as unknown as TypedDocumentString<RetrieveCloudIDsForHostnamesQuery, RetrieveCloudIDsForHostnamesQueryVariables>;
export const MarkGroupAsReadDocument = new TypedDocumentString(`
    mutation MarkGroupAsRead($groupId: String!) {
  notifications {
    markNotificationsByGroupIdAsRead(groupId: $groupId)
  }
}
    `) as unknown as TypedDocumentString<MarkGroupAsReadMutation, MarkGroupAsReadMutationVariables>;
export const MarkGroupAsUnreadDocument = new TypedDocumentString(`
    mutation MarkGroupAsUnread($groupId: String!) {
  notifications {
    markNotificationsByGroupIdAsUnread(groupId: $groupId)
  }
}
    `) as unknown as TypedDocumentString<MarkGroupAsUnreadMutation, MarkGroupAsUnreadMutationVariables>;
export const RetrieveJiraProjectTypesDocument = new TypedDocumentString(`
    query RetrieveJiraProjectTypes($cloudId: ID!, $keys: [String!]!) {
  jira {
    issuesByKey(cloudId: $cloudId, keys: $keys) {
      key
      summary
      projectField {
        project {
          name
          projectTypeName
          projectType
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<RetrieveJiraProjectTypesQuery, RetrieveJiraProjectTypesQueryVariables>;