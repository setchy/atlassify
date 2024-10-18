import { ExecutionResult } from 'graphql';

// Extend ExecutionResult to include `extensions`
declare module 'graphql' {
  // biome-ignore lint/suspicious/noExplicitAny:
  interface ExecutionResult<TData = any> {
    // biome-ignore lint/suspicious/noExplicitAny:
    extensions?: Record<string, any>;
  }
}
