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
  /** 逐词词义（德语 / 英语字幕用）：[原词（含标点）, 中文词义]，词义为空表示不标 */
  words?: Array<[word: string, gloss: string]>;
  /** 中文谐音读法（德语字幕用） */
  reading?: string;
}

/** 每种语言一条独立的字幕轨，按播放时间分别取当前句 */
export type SubtitleTracks = Record<Lang, Cue[]>;

export type LocalizedTitle = Record<Lang, string>;

/** 一张卡 = 一条完整视频。视频文件始终来自外部链接，应用本身不存放视频。 */
export interface Video {
  id: string;
  title: LocalizedTitle;
  /**
   * 视频直链（mp4 / webm 等浏览器可直接播放的地址）；内置的站内短片使用相对路径 media/…；
   * 也可以是哔哩哔哩视频页地址（见 bilibili.ts），此时用 B 站官方播放器播放，字幕由视频自带。
   */
  src: string;
  /** 所属剧集 / 系列名，例如「Nicos Weg A1」，用于片库分组 */
  series?: string;
  /** 在剧集中的集数，从 1 开始 */
  episode?: number;
  /** 原声语言：德语原声默认显示中·德字幕，英语原声默认中·英 */
  audioLang?: SecondaryLang;
  /** 备用外链：主链接打不开或卡住时按顺序自动切换，内容应与主链接相同 */
  mirrors?: string[];
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
  mirrors?: string[];
  poster?: string;
  /** WebVTT 或 SRT 文本 */
  subtitlesZh?: string;
  subtitlesDe?: string;
  subtitlesEn?: string;
  tags?: string[];
  series?: string;
  episode?: number;
  audioLang?: SecondaryLang;
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
