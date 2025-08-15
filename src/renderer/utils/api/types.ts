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

/**
 * The response from an Atlassian API request.
 */
export interface AtlassianGraphQLResponse<TData> {
  data: TData;
  errors?: AtlassianGraphQLError[];
  extensions?: AtlassianGraphQLExtensions;
}

interface AtlassianGraphQLError {
  message: string;
  extensions: {
    classification: string;
    errorType: string;
    statusCode: number;
  };
}

interface AtlassianGraphQLExtensions {
  notifications: {
    response_info: {
      responseSize: number;
    };
  };
}

export interface JiraProjectRestResponse {
  fields?: {
    project?: {
      projectTypeKey?: string;
    };
  };
}
