export interface Env {
  DB: D1Database;
  /** 用 `wrangler secret put JWT_SECRET` 设置 */
  JWT_SECRET: string;
  /** 允许跨域的前端地址，逗号分隔 */
  CORS_ORIGIN?: string;
  /** 设为 "1" 时找回密码接口直接返回重置令牌（仅本地开发 / 测试用，线上没有邮件服务时也不要开） */
  EXPOSE_RESET_TOKEN?: string;
  /** 德语学习手册的账号后端；配置后，手册的登录令牌也能用来访问 Vido */
  UUOO_API?: string;
  /** www.uuoo.site/vido/ 转发的前端站点（GitHub Pages） */
  SITE_ORIGIN?: string;
}

export interface Vars {
  userId: string;
}

export type AppEnv = { Bindings: Env; Variables: Vars };
