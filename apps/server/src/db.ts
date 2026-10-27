import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { SEED_VIDEOS, hasSubtitles, type SubtitleTracks, type User, type Video, type VideoSummary } from '@vido/shared';

export type DB = Database.Database;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS videos (
  id           TEXT PRIMARY KEY,
  position     INTEGER NOT NULL,
  title_zh     TEXT NOT NULL,
  title_de     TEXT NOT NULL,
  title_en     TEXT NOT NULL DEFAULT '',
  src          TEXT NOT NULL,
  mirrors      TEXT NOT NULL DEFAULT '[]',
  poster       TEXT,
  duration     REAL,
  source       TEXT NOT NULL,
  tags         TEXT NOT NULL DEFAULT '[]',
  subtitles_zh TEXT NOT NULL DEFAULT '[]',
  subtitles_de TEXT NOT NULL DEFAULT '[]',
  subtitles_en TEXT NOT NULL DEFAULT '[]',
  series       TEXT,
  episode      INTEGER,
  owner_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
  created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS videos_owner ON videos(owner_id);
CREATE TABLE IF NOT EXISTS password_resets (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  used       INTEGER NOT NULL DEFAULT 0
);
`;

export function openDatabase(file: string): DB {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  migrate(db);
  seedVideos(db);
  return db;
}

/** 给旧版本创建的数据库补上新增的列 */
function migrate(db: DB): void {
  const have = new Set((db.prepare('PRAGMA table_info(videos)').all() as Array<{ name: string }>).map((c) => c.name));
  const added: Record<string, string> = {
    title_en: "TEXT NOT NULL DEFAULT ''",
    mirrors: "TEXT NOT NULL DEFAULT '[]'",
    subtitles_en: "TEXT NOT NULL DEFAULT '[]'",
    series: 'TEXT',
    episode: 'INTEGER',
  };
  for (const [col, def] of Object.entries(added)) {
    if (!have.has(col)) db.exec(`ALTER TABLE videos ADD COLUMN ${col} ${def}`);
  }
}

function seedVideos(db: DB): void {
  const insert = db.prepare(`
    INSERT INTO videos
      (id, position, title_zh, title_de, title_en, src, mirrors, poster, duration, source, tags, subtitles_zh, subtitles_de, subtitles_en, series, episode, owner_id, created_at)
    VALUES
      (@id, @position, @title_zh, @title_de, @title_en, @src, @mirrors, @poster, @duration, @source, @tags, @subtitles_zh, @subtitles_de, @subtitles_en, @series, @episode, NULL, @created_at)
    ON CONFLICT(id) DO UPDATE SET
      position = excluded.position, title_zh = excluded.title_zh, title_de = excluded.title_de, title_en = excluded.title_en,
      src = excluded.src, mirrors = excluded.mirrors, poster = excluded.poster, duration = excluded.duration,
      source = excluded.source, tags = excluded.tags, subtitles_zh = excluded.subtitles_zh,
      subtitles_de = excluded.subtitles_de, subtitles_en = excluded.subtitles_en,
      series = excluded.series, episode = excluded.episode
    WHERE videos.owner_id IS NULL
  `);
  db.transaction(() => {
    // 内置片库随代码更新：每次启动按最新内容覆盖内置条目（不影响用户添加的视频）
    SEED_VIDEOS.forEach((v, position) => insert.run({ ...toRow(v), position }));
    // 已从内置片库移除的条目也从数据库删掉
    const ids = SEED_VIDEOS.map((v) => v.id);
    db.prepare(`DELETE FROM videos WHERE owner_id IS NULL AND id NOT IN (${ids.map(() => '?').join(',')})`).run(...ids);
  })();
}

// ---------- users ----------

interface UserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
}

export const toUser = (r: UserRow): User => ({ id: r.id, email: r.email, name: r.name, createdAt: r.created_at });

export const users = {
  byEmail: (db: DB, email: string) =>
    db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined,
  byId: (db: DB, id: string) => db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined,
  create: (db: DB, u: UserRow) =>
    db
      .prepare('INSERT INTO users (id, email, name, password_hash, created_at) VALUES (@id, @email, @name, @password_hash, @created_at)')
      .run(u),
  setPassword: (db: DB, id: string, hash: string) =>
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, id),
};

export const resets = {
  create: (db: DB, tokenHash: string, userId: string, expiresAt: number) =>
    db.prepare('INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(tokenHash, userId, expiresAt),
  /** 取出有效令牌并标记为已使用；无效时返回 undefined */
  consume: (db: DB, tokenHash: string, now: number) =>
    db.transaction(() => {
      const row = db
        .prepare('SELECT user_id FROM password_resets WHERE token_hash = ? AND used = 0 AND expires_at > ?')
        .get(tokenHash, now) as { user_id: string } | undefined;
      if (row) db.prepare('UPDATE password_resets SET used = 1 WHERE token_hash = ?').run(tokenHash);
      return row?.user_id;
    })(),
};

// ---------- videos ----------

interface VideoRow {
  id: string;
  title_zh: string;
  title_de: string;
  title_en: string;
  src: string;
  mirrors: string;
  poster: string | null;
  duration: number | null;
  source: string;
  tags: string;
  subtitles_zh: string;
  subtitles_de: string;
  subtitles_en: string;
  series: string | null;
  episode: number | null;
  owner_id: string | null;
  created_at: string;
}

function toRow(v: Video): VideoRow {
  return {
    id: v.id,
    title_zh: v.title.zh,
    title_de: v.title.de,
    title_en: v.title.en,
    src: v.src,
    mirrors: JSON.stringify(v.mirrors ?? []),
    poster: v.poster ?? null,
    duration: v.duration ?? null,
    source: v.source,
    tags: JSON.stringify(v.tags),
    subtitles_zh: JSON.stringify(v.subtitles.zh),
    subtitles_de: JSON.stringify(v.subtitles.de),
    subtitles_en: JSON.stringify(v.subtitles.en),
    series: v.series ?? null,
    episode: v.episode ?? null,
    owner_id: v.ownerId,
    created_at: v.createdAt,
  };
}

function fromRow(r: VideoRow): Video {
  const subtitles: SubtitleTracks = {
    zh: JSON.parse(r.subtitles_zh),
    de: JSON.parse(r.subtitles_de),
    en: JSON.parse(r.subtitles_en),
  };
  return {
    id: r.id,
    title: { zh: r.title_zh, de: r.title_de, en: r.title_en || r.title_de },
    src: r.src,
    ...(JSON.parse(r.mirrors).length ? { mirrors: JSON.parse(r.mirrors) as string[] } : {}),
    ...(r.poster ? { poster: r.poster } : {}),
    ...(r.duration != null ? { duration: r.duration } : {}),
    source: r.source,
    ...(r.series ? { series: r.series } : {}),
    ...(r.episode != null ? { episode: r.episode } : {}),
    tags: JSON.parse(r.tags),
    subtitles,
    ownerId: r.owner_id,
    createdAt: r.created_at,
  };
}

export function summarize(v: Video): VideoSummary {
  const { subtitles, ...rest } = v;
  return { ...rest, hasSubtitles: hasSubtitles(subtitles) };
}

export const videos = {
  /** 内置片库 + 当前用户自己添加的视频 */
  visibleTo: (db: DB, userId: string): Video[] =>
    (
      db
        .prepare('SELECT * FROM videos WHERE owner_id IS NULL OR owner_id = ? ORDER BY position, created_at')
        .all(userId) as VideoRow[]
    ).map(fromRow),
  byId: (db: DB, id: string): Video | undefined => {
    const row = db.prepare('SELECT * FROM videos WHERE id = ?').get(id) as VideoRow | undefined;
    return row && fromRow(row);
  },
  create: (db: DB, v: Video) => {
    const { max } = db.prepare('SELECT COALESCE(MAX(position), -1) AS max FROM videos').get() as { max: number };
    db.prepare(`
      INSERT INTO videos
        (id, position, title_zh, title_de, title_en, src, mirrors, poster, duration, source, tags, subtitles_zh, subtitles_de, subtitles_en, series, episode, owner_id, created_at)
      VALUES
        (@id, @position, @title_zh, @title_de, @title_en, @src, @mirrors, @poster, @duration, @source, @tags, @subtitles_zh, @subtitles_de, @subtitles_en, @series, @episode, @owner_id, @created_at)
    `).run({ ...toRow(v), position: max + 1 });
  },
  remove: (db: DB, id: string) => db.prepare('DELETE FROM videos WHERE id = ?').run(id),
};
