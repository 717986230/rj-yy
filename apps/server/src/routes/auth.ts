import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { ApiError, checkPassword, normalizeEmail, type Session } from '@vido/shared';
import type { Config } from '../config';
import { resets, toUser, users, type DB } from '../db';
import { hashPassword, newResetToken, requireAuth, sha256, signToken, verifyPassword } from '../lib/auth';

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

export function authRouter(db: DB, config: Config): Router {
  const r = Router();

  const session = (userId: string): Session => ({
    token: signToken(userId, config.jwtSecret),
    user: toUser(users.byId(db, userId)!),
  });

  r.post('/register', async (req, res) => {
    const body = RegisterBody.parse(req.body);
    if (users.byEmail(db, body.email)) throw new ApiError('CONFLICT', '该邮箱已注册，请直接登录');
    const id = randomUUID();
    users.create(db, {
      id,
      email: body.email,
      name: body.name || body.email.split('@')[0]!,
      password_hash: await hashPassword(body.password),
      created_at: new Date().toISOString(),
    });
    res.status(201).json(session(id));
  });

  r.post('/login', async (req, res) => {
    const body = LoginBody.parse(req.body);
    const user = users.byEmail(db, body.email);
    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      throw new ApiError('UNAUTHORIZED', '邮箱或密码不正确');
    }
    res.json(session(user.id));
  });

  r.post('/forgot', (req, res) => {
    const body = ForgotBody.parse(req.body);
    const user = users.byEmail(db, body.email);
    const message = '如果该邮箱已注册，重置链接已发送，请在 30 分钟内完成重置';
    if (!user) {
      // 不暴露邮箱是否存在
      res.json({ message });
      return;
    }
    const { token, hash } = newResetToken();
    resets.create(db, hash, user.id, Date.now() + RESET_TTL_MS);
    // TODO 接入邮件服务后在此发送包含 token 的重置链接
    res.json(config.exposeResetToken ? { message, devToken: token } : { message });
  });

  r.post('/reset', async (req, res) => {
    const body = ResetBody.parse(req.body);
    const userId = resets.consume(db, sha256(body.token), Date.now());
    if (!userId) throw new ApiError('BAD_REQUEST', '重置链接无效或已过期，请重新申请');
    users.setPassword(db, userId, await hashPassword(body.password));
    res.status(204).end();
  });

  r.get('/me', requireAuth(config.jwtSecret), (req, res) => {
    const user = users.byId(db, req.userId!);
    if (!user) throw new ApiError('UNAUTHORIZED', '账号不存在');
    res.json(toUser(user));
  });

  return r;
}
