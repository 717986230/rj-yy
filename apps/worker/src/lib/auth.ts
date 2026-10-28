import { sign, verify } from 'hono/jwt';
import type { MiddlewareHandler } from 'hono';
import { ApiError } from '@vido/shared';
import type { AppEnv } from '../env';
import { handbookUserId } from './handbook';

const TOKEN_TTL_S = 7 * 24 * 3600;
/**
 * PBKDF2 迭代次数。Workers 免费版每次请求只有 10ms CPU，10 万次大约要 17ms，会被掐断；
 * 3 万次约 5ms。次数写在哈希里，以后升级付费版可以调高，旧密码照样能验证（上限 100000）。
 */
const ITERATIONS = 30_000;

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function pbkdf2(password: string, salt: string, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations }, key, 256);
  return b64url(bits);
}

/** 存储格式：pbkdf2$<迭代次数>$<盐>$<哈希> */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomToken(16);
  return `pbkdf2$${ITERATIONS}$${salt}$${await pbkdf2(password, salt, ITERATIONS)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iter, salt, hash] = stored.split('$');
  if (scheme !== 'pbkdf2' || !iter || !salt || !hash) return false;
  const actual = await pbkdf2(password, salt, Number(iter));
  // 等长比较，避免按字符提前返回
  let diff = actual.length ^ hash.length;
  for (let i = 0; i < Math.min(actual.length, hash.length); i++) diff |= actual.charCodeAt(i) ^ hash.charCodeAt(i);
  return diff === 0;
}

export const randomToken = (bytes = 24) => b64url(crypto.getRandomValues(new Uint8Array(bytes)));

export async function sha256(s: string): Promise<string> {
  return b64url(await crypto.subtle.digest('SHA-256', enc.encode(s)));
}

export function signToken(userId: string, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return sign({ sub: userId, iat: now, exp: now + TOKEN_TTL_S }, secret, 'HS256');
}

/** 校验 Authorization: Bearer <jwt>，通过后把 userId 放进上下文 */
export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const header = c.req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  let sub: unknown;
  try {
    sub = (await verify(token, c.env.JWT_SECRET, 'HS256')).sub;
  } catch {
    // 不是 Vido 自己签发的令牌：可能是德语学习手册的登录令牌
    sub = await handbookUserId(c.env, token);
  }
  if (typeof sub !== 'string' || !sub) throw new ApiError('UNAUTHORIZED', '登录已过期，请重新登录');
  c.set('userId', sub);
  await next();
};
