export interface Config {
  port: number;
  jwtSecret: string;
  databaseFile: string;
  corsOrigins: string[];
  /** 开发模式下找回密码接口直接返回重置令牌，生产环境应改为发送邮件 */
  exposeResetToken: boolean;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const production = env.NODE_ENV === 'production';
  const jwtSecret = env.JWT_SECRET ?? (production ? '' : 'vido-dev-secret');
  if (!jwtSecret) throw new Error('生产环境必须设置 JWT_SECRET');
  return {
    port: Number(env.PORT ?? 8787),
    jwtSecret,
    databaseFile: env.DATABASE_FILE ?? './data/vido.db',
    corsOrigins: (env.CORS_ORIGIN ?? 'http://localhost:5173')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    exposeResetToken: !production,
  };
}
