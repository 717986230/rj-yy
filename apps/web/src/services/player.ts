import { externalSource, isBlockedMixedContent, type Video } from '@vido/shared';

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

/** 一条外链加载失败的记录，用于在界面上说明原因 */
export interface SourceFailure {
  url: string;
  host: string;
  reason: string;
}

/** 首帧到来之前最多等待多久，超时就换下一条备用链接 */
const STALL_MS = 12_000;

const MEDIA_ERRORS: Record<number, string> = {
  1: '加载被中断',
  2: '网络错误，连接被拒绝或中断',
  3: '视频解码失败',
  4: '链接打不开，或格式不受浏览器支持（可能被墙、防盗链或已失效）',
};

export interface PlayerEvents {
  /** 播放状态变化 */
  status: (status: PlayerStatus) => void;
  /** 每一帧（或每次跳转）报告当前播放时间，字幕据此实时刷新 */
  time: (seconds: number, duration: number) => void;
  /** 浏览器拦截了有声自动播放，已改为静音播放 */
  autoplayMuted: () => void;
  volume: (volume: number, muted: boolean) => void;
  /** 开始尝试某一条线路（主链接或备用链接） */
  source: (url: string, index: number, total: number) => void;
}

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: (now: number, meta: { mediaTime: number }) => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

/**
 * 对 <video> 的封装：加载外链、播放控制、帧级时间时钟。
 *
 * 字幕同步：播放中优先用 requestVideoFrameCallback 拿到每一帧对应的 mediaTime，
 * 不支持时退回 requestAnimationFrame 读取 currentTime；暂停、拖动进度时由
 * seeked / timeupdate 事件补发一次，保证字幕与画面始终一致。
 */
export class VideoEngine {
  private listeners: { [K in keyof PlayerEvents]: Set<PlayerEvents[K]> } = {
    status: new Set(),
    time: new Set(),
    autoplayMuted: new Set(),
    volume: new Set(),
    source: new Set(),
  };
  private status: PlayerStatus = 'idle';
  private frameHandle = 0;
  private rafHandle = 0;
  private current: Video | null = null;
  private sources: string[] = [];
  private sourceIndex = 0;
  private failures: SourceFailure[] = [];
  private stallTimer = 0;
  private wantPlay = false;
  private readonly detach: Array<() => void> = [];

  constructor(private readonly video: VideoWithFrameCallback) {
    video.playsInline = true;
    video.preload = 'auto';
    const bind = <K extends keyof HTMLMediaElementEventMap>(type: K, fn: () => void) => {
      video.addEventListener(type, fn);
      this.detach.push(() => video.removeEventListener(type, fn));
    };
    bind('loadstart', () => this.current && this.setStatus('loading'));
    bind('waiting', () => this.setStatus('loading'));
    bind('playing', () => {
      this.setStatus('playing');
      this.startClock();
    });
    bind('pause', () => {
      if (!video.ended && this.status !== 'error') this.setStatus('paused');
      this.stopClock();
      this.emitTime();
    });
    bind('ended', () => {
      this.stopClock();
      this.setStatus('ended');
    });
    bind('error', () => {
      if (!video.getAttribute('src')) return;
      this.fail(MEDIA_ERRORS[video.error?.code ?? 0] ?? '未知错误');
    });
    bind('loadeddata', () => clearTimeout(this.stallTimer));
    bind('loadedmetadata', () => this.emitTime());
    bind('seeked', () => this.emitTime());
    bind('timeupdate', () => {
      if (video.paused) this.emitTime();
    });
    bind('volumechange', () => this.listeners.volume.forEach((l) => l(video.volume, video.muted)));
  }

  on<K extends keyof PlayerEvents>(type: K, listener: PlayerEvents[K]): () => void {
    this.listeners[type].add(listener);
    return () => this.listeners[type].delete(listener);
  }

  get item(): Video | null {
    return this.current;
  }
  get time(): number {
    return this.video.currentTime || 0;
  }
  get duration(): number {
    const d = this.video.duration;
    return Number.isFinite(d) && d > 0 ? d : (this.current?.duration ?? 0);
  }
  get paused(): boolean {
    return this.video.paused;
  }
  get state(): PlayerStatus {
    return this.status;
  }

  /** 当前所有线路都失败时的原因列表 */
  get sourceFailures(): readonly SourceFailure[] {
    return this.failures;
  }

  /** 加载一条外链视频：依次尝试主链接和备用链接；autoplay 为 true 时立即播放 */
  load(item: Video, { autoplay = true } = {}): void {
    this.stopClock();
    this.current = item;
    this.sources = [item.src, ...(item.mirrors ?? [])];
    this.failures = [];
    this.wantPlay = autoplay;
    this.video.poster = item.poster ?? '';
    this.trySource(0);
  }

  async play(): Promise<void> {
    if (!this.current) return;
    this.wantPlay = true;
    if (this.status === 'error') return this.reload();
    try {
      await this.video.play();
    } catch (err) {
      if ((err as DOMException)?.name === 'NotAllowedError' && !this.video.muted) {
        this.video.muted = true;
        this.listeners.autoplayMuted.forEach((l) => l());
        await this.video.play().catch(() => this.setStatus('paused'));
      }
      // 其他错误（加载失败等）由 error 事件和换线逻辑处理
    }
  }

  pause(): void {
    this.video.pause();
  }

  toggle(): void {
    if (this.video.paused || this.video.ended) void this.play();
    else this.pause();
  }

  seek(seconds: number): void {
    const d = this.duration;
    this.video.currentTime = Math.max(0, d ? Math.min(seconds, d - 0.05) : seconds);
    this.emitTime(seconds);
  }

  setVolume(volume: number): void {
    this.video.volume = Math.min(1, Math.max(0, volume));
    if (volume > 0 && this.video.muted) this.video.muted = false;
  }

  setMuted(muted: boolean): void {
    this.video.muted = muted;
  }

  /** 从主链接开始重新尝试所有线路 */
  reload(): void {
    if (!this.current) return;
    this.failures = [];
    this.wantPlay = true;
    this.trySource(0);
  }

  /** 停止并清空当前视频（翻牌换片时调用） */
  unload(): void {
    clearTimeout(this.stallTimer);
    this.stopClock();
    this.video.pause();
    this.video.removeAttribute('src');
    this.video.removeAttribute('poster');
    this.video.load();
    this.current = null;
    this.sources = [];
    this.setStatus('idle');
    this.emitTime(0);
  }

  private trySource(index: number): void {
    clearTimeout(this.stallTimer);
    this.stopClock();
    const url = this.sources[index];
    if (url === undefined) {
      this.video.removeAttribute('src');
      this.setStatus('error');
      return;
    }
    this.sourceIndex = index;
    this.listeners.source.forEach((l) => l(url, index, this.sources.length));
    if (typeof location !== 'undefined' && isBlockedMixedContent(url, location.protocol)) {
      this.failures.push({ url, host: externalSource(url) ?? url, reason: '本站是 https，http 链接会被浏览器拦截' });
      return this.trySource(index + 1);
    }
    this.setStatus('loading');
    this.video.src = url;
    this.video.load();
    this.emitTime(0);
    this.stallTimer = window.setTimeout(() => this.fail(`超过 ${STALL_MS / 1000} 秒没有加载出画面`), STALL_MS);
    if (this.wantPlay) void this.play();
  }

  /** 当前线路失败：记录原因并换下一条 */
  private fail(reason: string): void {
    const url = this.sources[this.sourceIndex];
    if (!url || this.video.getAttribute('src') !== url) return;
    this.failures.push({ url, host: externalSource(url) ?? url, reason });
    this.trySource(this.sourceIndex + 1);
  }

  destroy(): void {
    this.unload();
    this.detach.forEach((d) => d());
  }

  private setStatus(next: PlayerStatus): void {
    if (this.status === next) return;
    this.status = next;
    this.listeners.status.forEach((l) => l(next));
  }

  private emitTime(at = this.video.currentTime || 0): void {
    const d = this.duration;
    this.listeners.time.forEach((l) => l(at, d));
  }

  private startClock(): void {
    this.stopClock();
    const v = this.video;
    if (v.requestVideoFrameCallback) {
      const step = (_now: number, meta: { mediaTime: number }) => {
        this.emitTime(meta.mediaTime);
        this.frameHandle = v.requestVideoFrameCallback!(step);
      };
      this.frameHandle = v.requestVideoFrameCallback(step);
      return;
    }
    // 兜底：不支持 requestVideoFrameCallback 的浏览器按屏幕刷新率读取 currentTime
    const tick = () => {
      this.emitTime();
      this.rafHandle = requestAnimationFrame(tick);
    };
    this.rafHandle = requestAnimationFrame(tick);
  }

  private stopClock(): void {
    if (this.frameHandle && this.video.cancelVideoFrameCallback) this.video.cancelVideoFrameCallback(this.frameHandle);
    cancelAnimationFrame(this.rafHandle);
    this.frameHandle = 0;
    this.rafHandle = 0;
  }
}
