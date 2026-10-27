import { bilingualAt, type SecondaryLang, type SubtitleTracks } from '@vido/shared';

/**
 * 双语字幕层：中文在上，第二语言（德语 / 英语）在下。
 * 每次播放器报告时间就调用 update；只有文字变化时才改 DOM，避免每帧重排。
 */
export class SubtitleOverlay {
  private zhEl: HTMLParagraphElement;
  private secondEl: HTMLParagraphElement;
  private lastZh: string | null = null;
  private lastSecond: string | null = null;

  constructor(private readonly root: HTMLElement) {
    root.classList.add('subs');
    root.setAttribute('aria-live', 'off');
    this.zhEl = document.createElement('p');
    this.zhEl.className = 'sub-zh';
    this.zhEl.lang = 'zh-CN';
    this.secondEl = document.createElement('p');
    this.secondEl.className = 'sub-second';
    root.replaceChildren(this.zhEl, this.secondEl);
  }

  update(tracks: SubtitleTracks | null, time: number, opts: { visible: boolean; second: SecondaryLang; offset: number }) {
    const line =
      tracks && opts.visible ? bilingualAt(tracks, time + opts.offset, opts.second) : { zh: null, second: null };
    if (line.zh !== this.lastZh) {
      this.zhEl.textContent = line.zh ?? '';
      this.lastZh = line.zh;
    }
    if (line.second !== this.lastSecond) {
      this.secondEl.textContent = line.second ?? '';
      this.secondEl.lang = opts.second;
      this.lastSecond = line.second;
    }
  }

  clear() {
    this.zhEl.textContent = '';
    this.secondEl.textContent = '';
    this.lastZh = this.lastSecond = null;
  }
}
