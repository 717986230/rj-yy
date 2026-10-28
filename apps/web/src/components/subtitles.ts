import { cueAt, type Cue, type SecondaryLang, type SubtitleTracks } from '@vido/shared';
import { esc } from '../app/dom';
import { icon } from './icons';

export interface SubtitleOptions {
  visible: boolean;
  second: SecondaryLang;
  offset: number;
  /** 显示逐词词义和谐音 */
  glosses: boolean;
}

/**
 * 学习字幕（参照「点句即听」的排法）：
 *   🔈 外语原句，每个词下面标中文词义
 *      整句中文翻译
 *      中文谐音读法（德语）
 * 每次播放器报告时间就调用 update；只有换句时才改 DOM。点喇叭重听这一句。
 */
export class SubtitleOverlay {
  private key: string | null = null;
  private cue: Cue | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly onReplay: (cue: Cue) => void,
  ) {
    root.classList.add('subs');
    root.setAttribute('aria-live', 'off');
    root.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('[data-replay]') && this.cue) this.onReplay(this.cue);
    });
  }

  update(tracks: SubtitleTracks | null, time: number, opts: SubtitleOptions) {
    const t = time + opts.offset;
    const second = tracks && opts.visible ? cueAt(tracks[opts.second], t) : null;
    const zh = tracks && opts.visible ? cueAt(tracks.zh, t) : null;
    const key = `${second?.start ?? ''}|${second?.text ?? ''}|${zh?.text ?? ''}|${opts.glosses}|${opts.second}`;
    if (key === this.key) return;
    this.key = key;
    this.cue = second ?? zh;
    if (!second && !zh) {
      this.root.replaceChildren();
      return;
    }
    const words = second?.words?.length ? second.words : second?.text.split(/\s+/).filter(Boolean).map((w) => [w, ''] as [string, string]);
    const glossed = opts.glosses && words?.some(([, g]) => g);
    const line = words
      ?.map(([w, g]) =>
        glossed
          ? `<span class="sub-w"><span class="sub-w-t">${esc(w)}</span><span class="sub-w-g">${esc(g) || '&nbsp;'}</span></span>`
          : `<span class="sub-w"><span class="sub-w-t">${esc(w)}</span></span>`,
      )
      .join('');
    this.root.innerHTML = `
      <div class="sub-block">
        <button data-replay class="sub-replay" aria-label="重听这一句" title="重听这一句">${icon('speaker', 'h-4 w-4')}</button>
        <div class="min-w-0 flex-1">
          ${line ? `<p class="sub-second" lang="${opts.second}">${line}</p>` : ''}
          ${zh ? `<p class="sub-zh" lang="zh-CN">${esc(zh.text)}</p>` : ''}
          ${opts.glosses && second?.reading ? `<p class="sub-reading" lang="zh-CN">${esc(second.reading)}</p>` : ''}
        </div>
      </div>`;
  }

  clear() {
    this.root.replaceChildren();
    this.key = null;
    this.cue = null;
  }
}
