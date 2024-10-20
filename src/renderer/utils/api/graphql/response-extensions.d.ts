import { ExecutionResult } from 'graphql';
import type {
  AtlassianGraphQLAPIError,
  AtlassianGraphQLExtensions,
} from '../types';

// Extend ExecutionResult to include `extensions`
declare module 'graphql' {
  interface ExecutionResult<TData = unknown> {
    extensions?: AtlassianGraphQLExtensions;
    errors?: AtlassianGraphQLAPIError[];
  }
}
