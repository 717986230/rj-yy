import {
  ApiError,
  SEED_VIDEOS,
  type ApiClient,
  type Credentials,
  type NewVideoInput,
  type PasswordResetRequestResult,
  type RegisterInput,
  type Session,
  type User,
  type Video,
  type VideoSummary,
} from '@vido/shared';
import { HANDBOOK, HANDBOOK_API } from '../../app/site';
import { tokenStore } from './token';

/** 连接 apps/server 的实现，接口路径与服务端路由一一对应 */
export class HttpApi implements ApiClient {
  readonly kind = 'http' as const;

  constructor(private readonly base: string) {}

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = tokenStore.get();
    let res: Response;
    try {
      res = await fetch(`${this.base.replace(/\/$/, '')}${path}`, {
        method,
        headers: {
          ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError('NETWORK', '连不上服务器，请检查网络后重试');
    }
    if (res.status === 204) return undefined as T;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw ApiError.fromStatus(res.status, data.message ?? `请求失败（${res.status}）`);
    return data as T;
  }

  private async withSession(p: Promise<Session>): Promise<Session> {
    const session = await p;
    tokenStore.set(session.token);
    return session;
  }

  register(input: RegisterInput) {
    return this.withSession(this.request<Session>('POST', '/auth/register', input));
  }
  login(input: Credentials) {
    if (HANDBOOK) return this.handbookLogin(input);
    return this.withSession(this.request<Session>('POST', '/auth/login', input));
  }
  /** 德语学习手册的账号：用户名 + 密码，令牌和手册共用 */
  private async handbookLogin({ email: username, password }: Credentials): Promise<Session> {
    let data: { token?: string; err?: string } = {};
    try {
      const res = await fetch(`${HANDBOOK_API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      data = await res.json().catch(() => ({}));
    } catch {
      throw new ApiError('NETWORK', '连不上服务器，请检查网络后重试');
    }
    if (!data.token) throw new ApiError('UNAUTHORIZED', data.err ?? '用户名或密码错误');
    tokenStore.set(data.token);
    const user = await this.me();
    if (!user) throw new ApiError('UNAUTHORIZED', '登录失败，请稍后再试');
    return { token: data.token, user };
  }
  async logout() {
    const token = tokenStore.get();
    tokenStore.clear();
    // 手册账号：同时让手册那边的会话失效（失败也无妨，本地已经退出）
    if (HANDBOOK && token) {
      void fetch(`${HANDBOOK_API}/api/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  }
  async me(): Promise<User | null> {
    if (!tokenStore.get()) return null;
    try {
      return await this.request<User>('GET', '/auth/me');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'UNAUTHORIZED') tokenStore.clear();
      return null;
    }
  }
  requestPasswordReset(email: string) {
    return this.request<PasswordResetRequestResult>('POST', '/auth/forgot', { email });
  }
  resetPassword(token: string, password: string) {
    return this.request<void>('POST', '/auth/reset', { token, password });
  }
  listVideos() {
    return this.request<VideoSummary[]>('GET', '/videos');
  }
  async getVideo(id: string) {
    // 内置片库本来就打包在前端里，不用每张卡都问一次服务器（播放页会预取全部卡片）
    const seed = SEED_VIDEOS.find((v) => v.id === id);
    if (seed) return seed;
    return this.request<Video>('GET', `/videos/${encodeURIComponent(id)}`);
  }
  addVideo(input: NewVideoInput) {
    return this.request<Video>('POST', '/videos', input);
  }
  deleteVideo(id: string) {
    return this.request<void>('DELETE', `/videos/${encodeURIComponent(id)}`);
  }
}
