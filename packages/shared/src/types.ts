/** 字幕语言。中文固定在上方，第二语言（德语或英语）在下方，可随时切换。 */
export type Lang = 'zh' | 'de' | 'en';
export type SecondaryLang = Exclude<Lang, 'zh'>;
export const SECONDARY_LANGS: readonly SecondaryLang[] = ['de', 'en'];

export interface Cue {
  /** 秒 */
  start: number;
  /** 秒 */
  end: number;
  text: string;
}

/** 每种语言一条独立的字幕轨，按播放时间分别取当前句 */
export type SubtitleTracks = Record<Lang, Cue[]>;

export type LocalizedTitle = Record<Lang, string>;

/** 一张卡 = 一条完整视频。视频文件始终来自外部链接，应用本身不存放视频。 */
export interface Video {
  id: string;
  title: LocalizedTitle;
  /** 外部视频直链（mp4 / webm / m3u8 等浏览器可播放的地址） */
  src: string;
  poster?: string;
  /** 秒，未知时省略 */
  duration?: number;
  /** 来源站点域名，例如 commondatastorage.googleapis.com */
  source: string;
  tags: string[];
  subtitles: SubtitleTracks;
  /** null 表示内置片库，否则为添加该视频的用户 */
  ownerId: string | null;
  createdAt: string;
}

export type VideoSummary = Omit<Video, 'subtitles'> & { hasSubtitles: boolean };

export type PlayMode = 'sequential' | 'shuffle' | 'manual';

export const PLAY_MODES: readonly PlayMode[] = ['sequential', 'shuffle', 'manual'];

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Session {
  token: string;
  user: User;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterInput extends Credentials {
  name?: string;
}

export interface NewVideoInput {
  titleZh: string;
  titleDe: string;
  titleEn?: string;
  src: string;
  poster?: string;
  /** WebVTT 或 SRT 文本 */
  subtitlesZh?: string;
  subtitlesDe?: string;
  subtitlesEn?: string;
  tags?: string[];
}

export interface PasswordResetRequestResult {
  message: string;
  /** 仅在开发/本地模式返回，方便演示重置流程；生产环境应通过邮件发送 */
  devToken?: string;
}

/**
 * 前端与后端之间的唯一契约。
 * Web 端有两个实现：LocalApi（浏览器存储，GitHub Pages 默认）和 HttpApi（连接 apps/server）。
 */
export interface ApiClient {
  readonly kind: 'local' | 'http';
  register(input: RegisterInput): Promise<Session>;
  login(input: Credentials): Promise<Session>;
  logout(): Promise<void>;
  me(): Promise<User | null>;
  requestPasswordReset(email: string): Promise<PasswordResetRequestResult>;
  resetPassword(token: string, password: string): Promise<void>;
  listVideos(): Promise<VideoSummary[]>;
  getVideo(id: string): Promise<Video>;
  addVideo(input: NewVideoInput): Promise<Video>;
  deleteVideo(id: string): Promise<void>;
}
