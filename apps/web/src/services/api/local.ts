import {
  ApiError,
  SEED_VIDEOS,
  checkPassword,
  emptyTracks,
  externalSource,
  hasSubtitles,
  isEmail,
  normalizeEmail,
  parseSubtitles,
  type ApiClient,
  type Credentials,
  type Cue,
  type NewVideoInput,
  type PasswordResetRequestResult,
  type RegisterInput,
  type Session,
  type User,
  type Video,
  type VideoSummary,
} from '@vido/shared';
import { storage } from '../../app/storage';
import { tokenStore } from './token';

/**
 * 纯前端实现：账号和自定义片库存放在浏览器本地。
 * 用于 GitHub Pages 这类纯静态托管，行为与 apps/server 的接口保持一致。
 * 密码使用 PBKDF2-SHA256 + 随机盐哈希，不保存明文。
 */

interface StoredUser extends User {
  salt: string;
  hash: string;
}

const K = {
  users: 'vido.local.users',
  sessions: 'vido.local.sessions',
  videos: 'vido.local.videos',
  resets: 'vido.local.resets',
};

export const DEMO_ACCOUNT = { email: 'demo@vido.app', password: 'vido2026' } as const;

const LATENCY_MS = 160;
const delay = () => new Promise((r) => setTimeout(r, LATENCY_MS));

const b64 = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf instanceof Uint8Array ? buf : new Uint8Array(buf))));
const randomId = (bytes = 16) => b64(crypto.getRandomValues(new Uint8Array(bytes))).replace(/[+/=]/g, '');

async function pbkdf2(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 120_000 },
    key,
    256,
  );
  return b64(bits);
}

const publicUser = ({ salt: _s, hash: _h, ...u }: StoredUser): User => u;

function parseOptionalSubtitles(text: string | undefined, label: string): Cue[] {
  if (!text?.trim()) return [];
  const cues = parseSubtitles(text);
  if (!cues.length) throw new ApiError('BAD_REQUEST', `${label}字幕没有读到内容，请检查 VTT / SRT 格式`);
  return cues;
}

export class LocalApi implements ApiClient {
  readonly kind = 'local' as const;

  private users = () => storage.get<StoredUser[]>(K.users, []);
  private sessions = () => storage.get<Record<string, string>>(K.sessions, {});
  private customVideos = () => storage.get<Video[]>(K.videos, []);

  /** 首次运行时创建演示账号，方便直接体验 */
  async ensureDemoAccount(): Promise<void> {
    if (this.users().some((u) => u.email === DEMO_ACCOUNT.email)) return;
    await this.createUser({ ...DEMO_ACCOUNT, name: '演示用户' });
  }

  private async createUser(input: RegisterInput): Promise<StoredUser> {
    const salt = randomId();
    const email = normalizeEmail(input.email);
    const user: StoredUser = {
      id: crypto.randomUUID(),
      email,
      name: input.name?.trim() || email.split('@')[0]!,
      createdAt: new Date().toISOString(),
      salt,
      hash: await pbkdf2(input.password, salt),
    };
    storage.set(K.users, [...this.users(), user]);
    return user;
  }

  private startSession(user: StoredUser): Session {
    const token = randomId(24);
    storage.set(K.sessions, { ...this.sessions(), [token]: user.id });
    tokenStore.set(token);
    return { token, user: publicUser(user) };
  }

  private requireUser(): StoredUser {
    const token = tokenStore.get();
    const userId = token ? this.sessions()[token] : undefined;
    const user = userId ? this.users().find((u) => u.id === userId) : undefined;
    if (!user) throw new ApiError('UNAUTHORIZED', '登录已过期，请重新登录');
    return user;
  }

  async register(input: RegisterInput): Promise<Session> {
    await delay();
    if (!isEmail(input.email)) throw new ApiError('BAD_REQUEST', '邮箱格式不正确');
    const problem = checkPassword(input.password);
    if (problem) throw new ApiError('BAD_REQUEST', problem);
    if (this.users().some((u) => u.email === normalizeEmail(input.email))) {
      throw new ApiError('CONFLICT', '该邮箱已注册，请直接登录');
    }
    return this.startSession(await this.createUser(input));
  }

  async login({ email, password }: Credentials): Promise<Session> {
    await delay();
    if (!isEmail(email)) throw new ApiError('BAD_REQUEST', '邮箱格式不正确');
    if (!password) throw new ApiError('BAD_REQUEST', '请输入密码');
    const user = this.users().find((u) => u.email === normalizeEmail(email));
    if (!user || (await pbkdf2(password, user.salt)) !== user.hash) {
      throw new ApiError('UNAUTHORIZED', '邮箱或密码不正确');
    }
    return this.startSession(user);
  }

  async logout(): Promise<void> {
    const token = tokenStore.get();
    if (token) {
      const { [token]: _, ...rest } = this.sessions();
      storage.set(K.sessions, rest);
    }
    tokenStore.clear();
  }

  async me(): Promise<User | null> {
    try {
      return publicUser(this.requireUser());
    } catch {
      return null;
    }
  }

  async requestPasswordReset(email: string): Promise<PasswordResetRequestResult> {
    await delay();
    if (!isEmail(email)) throw new ApiError('BAD_REQUEST', '邮箱格式不正确');
    const message = '如果该邮箱已注册，重置链接已发送，请在 30 分钟内完成重置';
    const user = this.users().find((u) => u.email === normalizeEmail(email));
    if (!user) return { message };
    const token = randomId(18);
    const resets = storage.get<Record<string, { userId: string; exp: number }>>(K.resets, {});
    storage.set(K.resets, { ...resets, [token]: { userId: user.id, exp: Date.now() + 30 * 60_000 } });
    // 纯前端模式没有邮件服务，直接返回令牌用于演示
    return { message, devToken: token };
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await delay();
    const problem = checkPassword(password);
    if (problem) throw new ApiError('BAD_REQUEST', problem);
    const resets = storage.get<Record<string, { userId: string; exp: number }>>(K.resets, {});
    const entry = resets[token];
    if (!entry || entry.exp < Date.now()) throw new ApiError('BAD_REQUEST', '重置链接无效或已过期，请重新申请');
    const { [token]: _, ...rest } = resets;
    storage.set(K.resets, rest);
    const salt = randomId();
    const hash = await pbkdf2(password, salt);
    storage.set(
      K.users,
      this.users().map((u) => (u.id === entry.userId ? { ...u, salt, hash } : u)),
    );
  }

  private visibleVideos(userId: string): Video[] {
    return [...SEED_VIDEOS, ...this.customVideos().filter((v) => v.ownerId === userId)];
  }

  async listVideos(): Promise<VideoSummary[]> {
    const user = this.requireUser();
    return this.visibleVideos(user.id).map(({ subtitles, ...v }) => ({ ...v, hasSubtitles: hasSubtitles(subtitles) || !!v.subtitlesUrl }));
  }

  async getVideo(id: string): Promise<Video> {
    const user = this.requireUser();
    const video = this.visibleVideos(user.id).find((v) => v.id === id);
    if (!video) throw new ApiError('NOT_FOUND', '视频不存在');
    return video;
  }

  async addVideo(input: NewVideoInput): Promise<Video> {
    await delay();
    const user = this.requireUser();
    const source = externalSource(input.src);
    if (!source) throw new ApiError('BAD_REQUEST', '视频链接必须是 http(s) 外部链接');
    const mirrors = (input.mirrors ?? []).map((m) => m.trim()).filter(Boolean);
    if (mirrors.some((m) => !externalSource(m))) throw new ApiError('BAD_REQUEST', '备用链接必须是 http(s) 外部链接');
    if (input.poster && !externalSource(input.poster)) throw new ApiError('BAD_REQUEST', '封面链接必须是 http(s) 外部链接');
    if (!input.titleZh.trim()) throw new ApiError('BAD_REQUEST', '请填写中文标题');
    if (!input.titleDe.trim()) throw new ApiError('BAD_REQUEST', '请填写德语标题');
    const subtitles = emptyTracks();
    subtitles.zh = parseOptionalSubtitles(input.subtitlesZh, '中文');
    subtitles.de = parseOptionalSubtitles(input.subtitlesDe, '德语');
    subtitles.en = parseOptionalSubtitles(input.subtitlesEn, '英语');
    const video: Video = {
      id: crypto.randomUUID(),
      title: { zh: input.titleZh.trim(), de: input.titleDe.trim(), en: input.titleEn?.trim() || input.titleDe.trim() },
      src: input.src.trim(),
      ...(mirrors.length ? { mirrors } : {}),
      ...(input.poster ? { poster: input.poster.trim() } : {}),
      source,
      ...(input.series?.trim() ? { series: input.series.trim() } : {}),
      ...(input.episode ? { episode: input.episode } : {}),
      ...(input.audioLang ? { audioLang: input.audioLang } : {}),
      tags: input.tags?.length ? input.tags : ['我的'],
      subtitles,
      ownerId: user.id,
      createdAt: new Date().toISOString(),
    };
    storage.set(K.videos, [...this.customVideos(), video]);
    return video;
  }

  async deleteVideo(id: string): Promise<void> {
    const user = this.requireUser();
    const video = this.customVideos().find((v) => v.id === id);
    if (!video) {
      throw SEED_VIDEOS.some((v) => v.id === id)
        ? new ApiError('FORBIDDEN', '内置视频不能删除')
        : new ApiError('NOT_FOUND', '视频不存在');
    }
    if (video.ownerId !== user.id) throw new ApiError('NOT_FOUND', '视频不存在');
    storage.set(
      K.videos,
      this.customVideos().filter((v) => v.id !== id),
    );
  }
}
