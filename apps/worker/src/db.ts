import { SEED_VIDEOS, hasSubtitles, type User, type Video, type VideoSummary } from '@vido/shared';

export interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
}

export const toUser = (r: UserRow): User => ({ id: r.id, email: r.email, name: r.name, createdAt: r.created_at });

export const users = {
  byEmail: (db: D1Database, email: string) => db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserRow>(),
  byId: (db: D1Database, id: string) => db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<UserRow>(),
  create: (db: D1Database, u: UserRow) =>
    db
      .prepare('INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(u.id, u.email, u.name, u.password_hash, u.created_at)
      .run(),
  setPassword: (db: D1Database, id: string, hash: string) =>
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(hash, id).run(),
};

export const resets = {
  create: (db: D1Database, tokenHash: string, userId: string, expiresAt: number) =>
    db.prepare('INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(tokenHash, userId, expiresAt).run(),
  /** 取出有效令牌并标记为已使用（单条 UPDATE … RETURNING，天然原子）；无效时返回 null */
  consume: async (db: D1Database, tokenHash: string, now: number) =>
    (
      await db
        .prepare('UPDATE password_resets SET used = 1 WHERE token_hash = ? AND used = 0 AND expires_at > ? RETURNING user_id')
        .bind(tokenHash, now)
        .first<{ user_id: string }>()
    )?.user_id ?? null,
};

export function summarize({ subtitles, ...v }: Video): VideoSummary {
  return { ...v, hasSubtitles: hasSubtitles(subtitles) || !!v.subtitlesUrl };
}

export const videos = {
  /** 内置片库（随 Worker 打包）+ 当前用户自己添加的视频 */
  visibleTo: async (db: D1Database, userId: string): Promise<Video[]> => {
    const { results } = await db
      .prepare('SELECT data FROM videos WHERE owner_id = ? ORDER BY created_at')
      .bind(userId)
      .all<{ data: string }>();
    return [...SEED_VIDEOS, ...results.map((r) => JSON.parse(r.data) as Video)];
  },
  /** 当前用户能看到的某条视频；不存在或属于别人时返回 null */
  visible: async (db: D1Database, id: string, userId: string): Promise<Video | null> => {
    const seed = SEED_VIDEOS.find((v) => v.id === id);
    if (seed) return seed;
    const row = await db.prepare('SELECT data FROM videos WHERE id = ? AND owner_id = ?').bind(id, userId).first<{ data: string }>();
    return row ? (JSON.parse(row.data) as Video) : null;
  },
  create: (db: D1Database, v: Video & { ownerId: string }) =>
    db
      .prepare('INSERT INTO videos (id, owner_id, data, created_at) VALUES (?, ?, ?, ?)')
      .bind(v.id, v.ownerId, JSON.stringify(v), v.createdAt)
      .run(),
  remove: (db: D1Database, id: string) => db.prepare('DELETE FROM videos WHERE id = ?').bind(id).run(),
};
