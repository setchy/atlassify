/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_APTABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
