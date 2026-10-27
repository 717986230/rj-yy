/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端 API 地址；为空时使用浏览器本地存储 */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
