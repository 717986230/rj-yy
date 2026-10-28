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
    return this.withSession(this.request<Session>('POST', '/auth/login', input));
  }
  async logout() {
    tokenStore.clear();
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
