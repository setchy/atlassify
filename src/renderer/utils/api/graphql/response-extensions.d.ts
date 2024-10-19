import { ExecutionResult } from 'graphql';

// Extend ExecutionResult to include `extensions`
declare module 'graphql' {
  // biome-ignore lint/suspicious/noExplicitAny:
  interface ExecutionResult<TData = any> {
    extensions?: {
      notifications: {
        response_info: {
          responseSize: number;
        };
      };
    };
  }
}
