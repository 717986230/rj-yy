import type { PlayMode, SecondaryLang, User } from '@vido/shared';
import { storage } from './storage';
import { Store } from './store';

export interface Prefs {
  mode: PlayMode;
  /** 中文下方显示的第二语言 */
  secondLang: SecondaryLang;
  subtitles: boolean;
  /** 字幕时间偏移（秒），正数表示字幕提前 */
  subtitleOffset: number;
  volume: number;
  muted: boolean;
  /** 用户隐藏的卡片（打不开或不想看的视频，内置的也可以隐藏） */
  hidden: string[];
}

export interface AppState extends Prefs {
  user: User | null;
  /** 从片库点选后，播放页要直接翻开的视频 */
  pendingVideoId: string | null;
}

const PREFS_KEY = 'vido.prefs';
const DEFAULT_PREFS: Prefs = {
  mode: 'manual',
  secondLang: 'de',
  subtitles: true,
  subtitleOffset: 0,
  volume: 0.8,
  muted: false,
  hidden: [],
};

const stored = storage.get<Partial<Prefs>>(PREFS_KEY, {});

export const app = new Store<AppState>({
  ...DEFAULT_PREFS,
  ...stored,
  // 每次打开都从有声开始：静音可能是浏览器拦截自动播放时临时加上的，不应该被记住
  muted: false,
  volume: stored.volume ? stored.volume : DEFAULT_PREFS.volume,
  user: null,
  pendingVideoId: null,
});

// 偏好设置变化时持久化
app.subscribe((s) => {
  const { mode, secondLang, subtitles, subtitleOffset, volume, hidden } = s;
  storage.set(PREFS_KEY, { mode, secondLang, subtitles, subtitleOffset, volume, hidden });
});

const WELCOME_KEY = 'vido.welcomed';
export const welcome = {
  seen: () => storage.get(WELCOME_KEY, false),
  markSeen: () => storage.set(WELCOME_KEY, true),
};
