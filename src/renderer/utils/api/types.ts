/**
 * The different types of API errors which may be encountered.
 */
export type AtlassianAPIError =
  | AtlassianHTTPError
  | AtlassianAuthError
  | AtlassianGraphQLErrors;

interface AtlassianAuthError {
  code: number;
  message: string;
}

interface AtlassianHTTPError {
  status: number;
  message: string;
}

interface AtlassianGraphQLErrors {
  errors: AtlassianGraphQLError[];
}

export interface AtlassianGraphQLError {
  message: string;
  extensions: {
    classification: string;
    errorType: string;
    statusCode: number;
  };
}

export interface AtlassianGraphQLExtensions {
  notifications: {
    response_info: {
      responseSize: number;
    };
  };
}
