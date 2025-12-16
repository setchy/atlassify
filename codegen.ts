import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://developer.atlassian.com/gateway/api/graphql',
  documents: ['src/renderer/utils/api/**/*.graphql'],
  generates: {
    'src/renderer/utils/api/graphql/generated/': {
      preset: 'client',
      config: {
        documentMode: 'string',
        useTypeImports: true,
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
