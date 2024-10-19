/**
 * The different types of API errors which may be encountered.
 */
export type AtlassianAPIError =
  | AtlassianHTTPError
  | AtlassianAuthError
  | AtlassianGraphQLAPIErrors;

interface AtlassianAuthError {
  code: number;
  message: string;
}

interface AtlassianHTTPError {
  status: number;
  message: string;
}

interface AtlassianGraphQLAPIErrors {
  errors: GraphQLAPIError[];
}

interface GraphQLAPIError {
  message: string;
  extensions: {
    classification: string;
    errorType: string;
    statusCode: number;
  };
}
