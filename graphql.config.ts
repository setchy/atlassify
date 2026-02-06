import type { IGraphQLConfig } from 'graphql-config';

const config: IGraphQLConfig = {
  schema: 'https://developer.atlassian.com/gateway/api/graphql',
  documents: ['src/renderer/utils/api/**/*.graphql'],
};

export default config;
