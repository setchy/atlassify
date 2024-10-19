import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://developer.atlassian.com/gateway/api/graphql',
  documents: 'src/renderer/utils/api/*.ts',
  generates: {
    'src/renderer/utils/api/graphql/generated/': {
      preset: 'client',
      config: {
        documentMode: 'string',
        customResponseType: true, // Enable custom response type so we can include extensions in the response
        exportFragmentSpreadSubTypes: true,
      },
    },
    'src/renderer/utils/api/graphql/generated/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
