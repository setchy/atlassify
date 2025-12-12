/**
 * The different types of API errors which may be encountered.
 */
export type AtlassianAPIError = AtlassianHTTPError | AtlassianAuthError;

interface AtlassianAuthError {
  code: number;
  message: string;
}

interface AtlassianHTTPError {
  status: number;
  message: string;
}

export interface AtlassianGraphQLExtensions {
  notifications: {
    response_info: {
      responseSize: number;
    };
  };
}

export interface JiraProjectRestResponse {
  projectTypeKey: JiraProjectType;
}

/**
 * Jira Project types
 *
 * - 'business' - A business project.
 * - 'customer_service' - A customer service project.
 * - 'product_discovery' - A product discovery project.
 * - 'service_desk' - A service desk project.
 * - 'software' - A software development project.
 *
 * See https://support.atlassian.com/jira-work-management/docs/what-is-the-jira-family-of-applications/#Jiraapplicationsoverview-Productfeaturesandprojecttypes
 */
export type JiraProjectType =
  | 'business'
  | 'customer_service'
  | 'product_discovery'
  | 'service_desk'
  | 'software';
