import type { Video } from '@vido/shared';

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface PlayerEvents {
  /** 播放状态变化 */
  status: (status: PlayerStatus) => void;
  /** 每一帧（或每次跳转）报告当前播放时间，字幕据此实时刷新 */
  time: (seconds: number, duration: number) => void;
  /** 浏览器拦截了有声自动播放，已改为静音播放 */
  autoplayMuted: () => void;
  volume: (volume: number, muted: boolean) => void;
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
  };
  private status: PlayerStatus = 'idle';
  private frameHandle = 0;
  private rafHandle = 0;
  private current: Video | null = null;
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
      this.stopClock();
      this.setStatus('error');
    });
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

  /** 加载一条外链视频；autoplay 为 true 时立即播放 */
  load(item: Video, { autoplay = true } = {}): void {
    this.stopClock();
    this.current = item;
    this.video.poster = item.poster ?? '';
    this.video.src = item.src;
    this.setStatus('loading');
    this.video.load();
    this.emitTime();
    if (autoplay) void this.play();
  }

  async play(): Promise<void> {
    if (!this.current) return;
    if (this.status === 'error') this.reload();
    try {
      await this.video.play();
    } catch (err) {
      if ((err as DOMException)?.name === 'NotAllowedError' && !this.video.muted) {
        this.video.muted = true;
        this.listeners.autoplayMuted.forEach((l) => l());
        await this.video.play().catch(() => this.setStatus('paused'));
      } else if ((err as DOMException)?.name !== 'AbortError') {
        // 加载失败由 error 事件处理
      }
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

  reload(): void {
    if (!this.current) return;
    const t = this.video.currentTime;
    this.video.src = this.current.src;
    this.video.load();
    if (t) this.video.currentTime = t;
  }

  /** 停止并清空当前视频（翻牌换片时调用） */
  unload(): void {
    this.stopClock();
    this.video.pause();
    this.video.removeAttribute('src');
    this.video.removeAttribute('poster');
    this.video.load();
    this.current = null;
    this.setStatus('idle');
    this.emitTime(0);
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
