import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://developer.atlassian.com/gateway/api/graphql',
  documents: ['src/renderer/utils/api/**/*.graphql'],
  generates: {
    'src/renderer/utils/api/graphql/generated/graphql.ts': {
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        documentMode: 'string',
        enumType: 'native',
        scalars: {
          DateTime: 'string',
          URL: '../../../../types#Link',
        },
        useTypeImports: true,
      },
    },
  },
};

export default config;
