import { Hono } from 'hono';
import { z } from 'zod';
import { ApiError, checkPassword, normalizeEmail, type Session } from '@vido/shared';
import type { AppEnv } from '../env';
import { resets, toUser, users } from '../db';
import { hashPassword, randomToken, requireAuth, sha256, signToken, verifyPassword } from '../lib/auth';

const RESET_TTL_MS = 30 * 60 * 1000;

const email = z.string({ required_error: '请输入邮箱' }).email('邮箱格式不正确').transform(normalizeEmail);
const password = z
  .string({ required_error: '请输入密码' })
  .superRefine((v, ctx) => {
    const problem = checkPassword(v);
    if (problem) ctx.addIssue({ code: z.ZodIssueCode.custom, message: problem });
  });

const RegisterBody = z.object({ email, password, name: z.string().trim().max(40).optional() });
const LoginBody = z.object({ email, password: z.string({ required_error: '请输入密码' }).min(1, '请输入密码') });
const ForgotBody = z.object({ email });
const ResetBody = z.object({ token: z.string().min(1, '缺少重置令牌'), password });

export const authRoutes = new Hono<AppEnv>();

async function session(db: D1Database, secret: string, userId: string): Promise<Session> {
  return { token: await signToken(userId, secret), user: toUser((await users.byId(db, userId))!) };
}

authRoutes.post('/register', async (c) => {
  const body = RegisterBody.parse(await c.req.json());
  if (await users.byEmail(c.env.DB, body.email)) throw new ApiError('CONFLICT', '该邮箱已注册，请直接登录');
  const id = crypto.randomUUID();
  await users.create(c.env.DB, {
    id,
    email: body.email,
    name: body.name || body.email.split('@')[0]!,
    password_hash: await hashPassword(body.password),
    created_at: new Date().toISOString(),
  });
  return c.json(await session(c.env.DB, c.env.JWT_SECRET, id), 201);
});

authRoutes.post('/login', async (c) => {
  const body = LoginBody.parse(await c.req.json());
  const user = await users.byEmail(c.env.DB, body.email);
  if (!user || !(await verifyPassword(body.password, user.password_hash))) {
    throw new ApiError('UNAUTHORIZED', '邮箱或密码不正确');
  }
  return c.json(await session(c.env.DB, c.env.JWT_SECRET, user.id));
});

authRoutes.post('/forgot', async (c) => {
  const body = ForgotBody.parse(await c.req.json());
  const expose = c.env.EXPOSE_RESET_TOKEN === '1';
  const user = await users.byEmail(c.env.DB, body.email);
  if (!expose) {
    // 还没接邮件服务：线上不能把令牌直接返回（否则知道邮箱就能改别人的密码）
    return c.json({ message: '暂不支持自助找回密码，请联系管理员重置' });
  }
  const message = '如果该邮箱已注册，重置链接已发送，请在 30 分钟内完成重置';
  // 不暴露邮箱是否存在
  if (!user) return c.json({ message });
  const token = randomToken();
  await resets.create(c.env.DB, await sha256(token), user.id, Date.now() + RESET_TTL_MS);
  return c.json({ message, devToken: token });
});

authRoutes.post('/reset', async (c) => {
  const body = ResetBody.parse(await c.req.json());
  const userId = await resets.consume(c.env.DB, await sha256(body.token), Date.now());
  if (!userId) throw new ApiError('BAD_REQUEST', '重置链接无效或已过期，请重新申请');
  await users.setPassword(c.env.DB, userId, await hashPassword(body.password));
  return c.body(null, 204);
});

authRoutes.get('/me', requireAuth, async (c) => {
  const user = await users.byId(c.env.DB, c.get('userId'));
  if (!user) throw new ApiError('UNAUTHORIZED', '账号不存在');
  return c.json(toUser(user));
});
