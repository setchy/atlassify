import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    // The public Atlassian schema fails graphql-js v17's stricter
    // interface-deprecation-consistency validation (for example when
    // printing the SDL), so skip validation during introspection.
    'https://developer.atlassian.com/gateway/api/graphql': {
      assumeValid: true,
    },
  },
  documents: [
    'src/renderer/utils/api/**/*.graphql',
    '!src/renderer/utils/api/graphql/generated/**',
  ],
  generates: {
    'src/renderer/utils/api/graphql/generated/graphql.ts': {
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        documentMode: 'string',
        skipDocumentsValidation: true, // FIXME - ideally re-enable validation
        enumType: 'native',
        scalars: {
          DateTime: 'string',
          URL: '../../../../types#Link',
        },
        useTypeImports: true,
      },
    },
    // Local schema snapshot for the GraphQL editor (see graphql.config.ts).
    'src/renderer/utils/api/graphql/generated/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
        skipDocumentsValidation: true, // same public-schema/runtime divergence as graphql.ts
      },
    },
  },
};

export default config;
