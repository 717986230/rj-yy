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

const api = new Hono<AppEnv>();
api.get('/health', (c) => c.json({ ok: true }));
api.route('/auth', authRoutes);
api.route('/videos', videoRoutes);

app.route('/api', api);

// ---- 挂在德语学习手册下：www.uuoo.site/vido/*（Cloudflare 路由指到本 Worker）----
// API 同域挂在 /vido/api，前端页面原样转发 GitHub Pages 上的构建，视频文件直接跳转过去（不经 Worker 中转流量）
const site = (c: { env: AppEnv['Bindings'] }) => (c.env.SITE_ORIGIN ?? 'https://717986230.github.io/rj-yy').replace(/\/$/, '');

app.route('/vido/api', api);
app.get('/vido', (c) => c.redirect(`/vido/${new URL(c.req.url).search}`, 301));
app.on(['GET', 'HEAD'], '/vido/media/*', (c) => c.redirect(site(c) + c.req.path.slice('/vido'.length), 302));
app.on(['GET', 'HEAD'], '/vido/*', async (c) => {
  const url = new URL(c.req.url);
  const res = await fetch(site(c) + url.pathname.slice('/vido'.length) + url.search, {
    method: c.req.method,
    headers: { Accept: c.req.header('accept') ?? '*/*' },
    redirect: 'manual',
  });
  const headers = new Headers(res.headers);
  // GitHub Pages 的跳转地址指向 github.io，换回本站路径
  const loc = headers.get('location');
  if (loc?.startsWith(site(c))) headers.set('location', '/vido' + loc.slice(site(c).length));
  return new Response(res.body, { status: res.status, headers });
});

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
