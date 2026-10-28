import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ZodError } from 'zod';
import { ApiError } from '@vido/shared';
import type { AppEnv } from './env';
import { authRoutes } from './routes/auth';
import { videoRoutes } from './routes/videos';

const app = new Hono<AppEnv>();

app.use('/api/*', (c, next) =>
  cors({
    origin: (c.env.CORS_ORIGIN ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })(c, next),
);

app.get('/api/health', (c) => c.json({ ok: true }));
app.route('/api/auth', authRoutes);
app.route('/api/videos', videoRoutes);

app.notFound((c) => c.json({ code: 'NOT_FOUND', message: '接口不存在' }, 404));

app.onError((err, c) => {
  if (err instanceof ZodError) {
    return c.json({ code: 'BAD_REQUEST', message: err.issues[0]?.message ?? '请求参数有误' }, 400);
  }
  if (err instanceof ApiError) {
    return c.json({ code: err.code, message: err.message }, err.status as 400);
  }
  if (err instanceof SyntaxError) {
    return c.json({ code: 'BAD_REQUEST', message: '请求体不是有效的 JSON' }, 400);
  }
  console.error(err);
  return c.json({ code: 'INTERNAL', message: '服务器出错了，请稍后再试' }, 500);
});

export default app;
