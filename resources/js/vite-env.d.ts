/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_URL: string
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
