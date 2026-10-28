import type { Env } from '../env';

/**
 * 德语学习手册（www.uuoo.site）的账号：手册的会话令牌交给手册后端的 /api/me 验证，
 * 通过后在 Vido 的 users 表里建一个对应的影子账号（id = uuoo:<用户名>，没有密码，只能用手册令牌登录），
 * 这样自定义片库等数据照常按 userId 存。验证结果在当前实例里缓存几分钟，免得每个请求都去问一次。
 */
const CACHE_MS = 5 * 60 * 1000;
const cache = new Map<string, { userId: string | null; until: number }>();

interface HandbookMe {
  user?: { username?: string; nickname?: string };
}

export async function handbookUserId(env: Env, token: string): Promise<string | null> {
  if (!env.UUOO_API || !token) return null;
  const hit = cache.get(token);
  if (hit && hit.until > Date.now()) return hit.userId;

  let userId: string | null = null;
  try {
    const res = await fetch(`${env.UUOO_API.replace(/\/$/, '')}/api/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const { username, nickname } = ((await res.json()) as HandbookMe).user ?? {};
      if (username) {
        const name = nickname || username;
        userId = `uuoo:${username}`;
        await env.DB.prepare(
          'INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name',
        )
          .bind(userId, userId, name, '', new Date().toISOString())
          .run();
      }
    }
  } catch {
    return null; // 手册后端暂时连不上：不缓存，下次再试
  }
  if (cache.size > 1000) cache.clear();
  cache.set(token, { userId, until: Date.now() + CACHE_MS });
  return userId;
}
