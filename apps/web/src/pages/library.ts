import {
  bilibiliPageUrl,
  externalSource,
  isB23Short,
  isBilibili,
  isBlockedMixedContent,
  parseBilibili,
  type NewVideoInput,
  type VideoSummary,
} from '@vido/shared';
import { el, esc, formatTime, refs, type Cleanup } from '../app/dom';
import type { RouteContext } from '../app/router';
import { app } from '../app/state';
import { bindLibraryThemeSwitch, libraryThemeSwitch } from '../components/topbar';
import { busy, errorMessage } from '../components/form';
import { icon } from '../components/icons';
import { toast } from '../components/toast';
import { api } from '../services/api';
import { probeSources, runLimited, type ProbeResult } from '../services/probe';

const SAMPLE_ZH = `WEBVTT

00:00:01.000 --> 00:00:04.000
第一句中文字幕`;

const subtitleInput = (lang: 'zh' | 'de' | 'en', label: string, placeholder: string) => `
  <div class="grid gap-1.5">
    <div class="flex items-center justify-between text-xs">
      <span class="text-mute">${label}字幕（VTT / SRT，可选）</span>
      <label class="cursor-pointer text-aqua">选择文件<input type="file" accept=".vtt,.srt,text/vtt" class="sr-only" data-file="${lang}" /></label>
    </div>
    <textarea id="add-sub-${lang}" rows="3" placeholder="${esc(placeholder)}" class="scroll-area w-full resize-y rounded-2xl border border-line/15 bg-panel px-3 py-2 font-mono text-xs text-fg outline-none placeholder:text-mute/50 focus:border-aqua/60"></textarea>
  </div>`;

const input = (id: string, placeholder: string, type = 'text') =>
  `<input id="${id}" type="${type}" placeholder="${esc(placeholder)}" class="h-11 w-full rounded-2xl border border-line/15 bg-panel px-3.5 text-sm text-fg outline-none placeholder:text-mute/60 focus:border-aqua/60" />`;

export function libraryPage(root: HTMLElement, { navigate }: RouteContext): Cleanup {
  const view = el(`
    <section class="screen gap-3">
      <div class="flex items-center gap-1">
        <a href="#/play" class="icon-btn -ml-2" aria-label="返回播放">${icon('back')}</a>
        <h1 class="text-lg font-bold">片库</h1>
        <div data-ref="topbar" class="ml-auto">${libraryThemeSwitch()}</div>
        <button data-ref="toggleAdd" class="btn-ghost h-9 px-2.5" aria-label="添加视频" title="添加视频">${icon('plus', 'h-4 w-4')}添加</button>
      </div>
      <div class="flex items-start gap-2">
        <p class="flex-1 text-xs leading-relaxed text-mute">站内影片随网站托管，任何网络都能播。B 站卡片是实验功能：用 B 站播放器，可能因视频被删或地区限制打不开，默认不进抽卡牌堆，可以在这里点开播放。</p>
        <button data-ref="biliDeck" class="btn-ghost h-8 shrink-0 px-3 text-xs" aria-pressed="false"></button>
        <button data-ref="probe" class="btn-ghost h-8 shrink-0 px-3 text-xs">${icon('refresh', 'h-3.5 w-3.5')}检测外链</button>
      </div>

      <div class="scroll-area -mx-1 min-h-0 flex-1 px-1">
        <form data-ref="form" class="mb-4 grid gap-2.5 rounded-3xl border border-aqua/20 bg-aqua/[0.06] p-3.5" hidden novalidate>
          <p class="text-sm font-bold">添加视频</p>
          <p class="-mt-1 text-xs leading-relaxed text-mute">粘贴 B 站视频地址（例如 https://www.bilibili.com/video/BV…/?p=1），或 mp4 视频直链。</p>
          ${input('add-src', 'B 站链接 / BV 号 / 视频直链', 'url')}
          <div data-ref="biliFields" class="grid gap-2 rounded-2xl border border-line/10 bg-panel/60 p-3" hidden>
            <p class="text-xs leading-relaxed text-cream/90">B 站视频：用 B 站播放器播放，字幕用视频自带的（选带「中德字幕」的视频）。一个链接有多集（分 P）时，填集数范围一次加进来。</p>
            ${input('add-series', '剧集名，例如 Nicos Weg A1')}
            <div class="grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-2 text-xs text-mute">
              从第 ${input('add-ep-from', '1', 'number')} 集到第 ${input('add-ep-to', '1', 'number')} 集
            </div>
          </div>
          <textarea id="add-mirrors" data-direct rows="2" placeholder="备用链接（可选，每行一条，主链接打不开时自动切换）" class="w-full resize-y rounded-2xl border border-line/15 bg-panel px-3.5 py-2 text-sm text-fg outline-none placeholder:text-mute/60 focus:border-aqua/60"></textarea>
          <div class="grid grid-cols-2 gap-2">
            ${input('add-title-zh', '中文标题')}
            ${input('add-title-de', 'Deutscher Titel')}
          </div>
          <div class="grid grid-cols-2 gap-2">
            ${input('add-title-en', 'English title（可选）')}
            ${input('add-poster', '封面图链接（可选）', 'url')}
          </div>
          <div data-direct class="grid gap-2.5">
            ${subtitleInput('zh', '中文', SAMPLE_ZH)}
            ${subtitleInput('de', '德语', '00:00:01.000 --> 00:00:04.000\nErster deutscher Untertitel')}
            ${subtitleInput('en', '英语', '00:00:01.000 --> 00:00:04.000\nFirst English subtitle')}
          </div>
          <p data-ref="error" class="field-error"></p>
          <button data-ref="submit" class="btn-primary w-full">保存到我的片库</button>
        </form>

        <ul data-ref="list" class="grid grid-cols-[minmax(0,1fr)] gap-2.5 pb-2">
          <li class="py-10 text-center text-sm text-mute">片库加载中…</li>
        </ul>
      </div>
    </section>`);

  const r = refs<{
    toggleAdd: HTMLButtonElement;
    probe: HTMLButtonElement;
    biliDeck: HTMLButtonElement;
    topbar: HTMLElement;
    form: HTMLFormElement;
    biliFields: HTMLElement;
    error: HTMLElement;
    submit: HTMLButtonElement;
    list: HTMLUListElement;
  }>(view);
  root.append(view);

  const userId = app.get().user?.id;
  let confirmId: string | null = null;
  const probes = new Map<string, ProbeResult | 'pending'>();

  const probeChip = (id: string) => {
    const p = probes.get(id);
    if (!p) return '';
    if (p === 'pending') return '<span class="chip">检测中…</span>';
    return p.ok
      ? `<span class="chip text-aqua" title="${esc(p.detail)}">可播放</span>`
      : `<span class="chip text-coral" title="${esc(p.detail)}">打不开</span>`;
  };

  const row = (v: VideoSummary, i: number) => {
    const mine = v.ownerId === userId;
    const isHidden = hiddenIds().has(v.id);
    const thumb = v.poster
      ? `<img src="${esc(v.poster)}" alt="" loading="lazy" class="h-full w-full object-cover" onerror="this.remove()" />`
      : '';
    return `
      <li class="flex items-center gap-3 rounded-2xl border border-line/10 bg-panel p-2.5 ${isHidden ? 'opacity-50' : ''}">
        <button data-play="${esc(v.id)}" class="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span class="relative grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-raised text-aqua">
            ${icon('play', 'h-5 w-5 absolute')}${thumb}
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-baseline gap-2">
              <span class="font-display text-[11px] font-semibold text-aqua">${String(i + 1).padStart(2, '0')}</span>
              <span class="truncate text-sm font-bold">${esc(v.title.zh)}</span>
            </span>
            <span class="block truncate text-xs italic text-cream/75">${esc(v.title.de)} · ${esc(v.title.en)}</span>
            <span class="mt-1 flex flex-wrap items-center gap-1.5">
              <span class="chip max-w-[150px] truncate">${icon('link', 'h-3 w-3')}${esc(isBilibili(v.src) ? 'B站' : v.source)}</span>
              ${v.duration ? `<span class="chip tabular-nums">${formatTime(v.duration)}</span>` : ''}
              ${v.episode ? `<span class="chip text-cream">第 ${v.episode} 集</span>` : ''}
              ${v.hasSubtitles ? '<span class="chip text-aqua">双语字幕</span>' : isBilibili(v.src) ? '<span class="chip text-aqua">中德字幕 · 画面内</span>' : ''}
              ${mine ? '<span class="chip text-cream">我的</span>' : ''}
              ${v.mirrors?.length ? `<span class="chip">${v.mirrors.length + 1} 条线路</span>` : ''}
              ${probeChip(v.id)}
            </span>
          </span>
        </button>
        <button data-hide="${esc(v.id)}" class="icon-btn shrink-0 !w-auto px-2 text-[11px] text-mute" aria-label="${isHidden ? '恢复' : '隐藏'}">${isHidden ? '恢复' : '隐藏'}</button>
        ${
          mine
            ? `<button data-del="${esc(v.id)}" class="icon-btn shrink-0 ${confirmId === v.id ? '!w-auto bg-coral/15 px-3 text-xs text-coral' : 'text-mute'}" aria-label="删除">${confirmId === v.id ? '确认删除' : icon('trash', 'h-4 w-4')}</button>`
            : ''
        }
      </li>`;
  };

  let items: VideoSummary[] = [];
  const hiddenIds = () => new Set(app.get().hidden);
  const render = () => {
    // 按剧集分组：同一剧集的各集排在一起，组标题显示集数
    const order: string[] = [];
    const groups = new Map<string, Array<[VideoSummary, number]>>();
    const lib = app.get().secondLang;
    items.forEach((v, i) => {
      // 中德 / 中英两个片库分开显示；没标原声的自己添加的视频两边都显示
      if (v.audioLang && v.audioLang !== lib) return;
      const key = hiddenIds().has(v.id) ? '\u0000已隐藏' : (v.series ?? '');
      if (!groups.has(key)) groups.set(key, []), order.push(key);
      groups.get(key)!.push([v, i]);
    });
    const header = (name: string, n: number) =>
      `<li class="pt-2 text-xs font-bold text-aqua">${esc(name.replace('\u0000', '') || '短片 / 单部视频')} <span class="font-normal text-mute">· ${n} 部</span></li>`;
    // 剧集在前，单部视频在后
    const rank = (k: string) => (k.startsWith('\u0000') ? 2 : k ? 0 : 1);
    order.sort((a, b) => rank(a) - rank(b));
    r.list.innerHTML = order.length
      ? order
          .map((key) => {
            const list = groups.get(key)!.sort(([a], [b]) => (a.episode ?? 0) - (b.episode ?? 0));
            return header(key, list.length) + list.map(([v, i]) => row(v, i)).join('');
          })
          .join('')
      : '<li class="py-10 text-center text-sm text-mute">片库还是空的，添加第一条外链吧</li>';
  };

  const load = async () => {
    try {
      items = await api.listVideos();
      render();
    } catch (err) {
      r.list.innerHTML = `<li class="py-10 text-center text-sm text-coral">${esc(errorMessage(err))}</li>`;
    }
  };

  r.list.onclick = async (e) => {
    const target = e.target as HTMLElement;
    const playId = target.closest<HTMLElement>('[data-play]')?.dataset.play;
    if (playId) {
      app.set({ pendingVideoId: playId });
      navigate('/play');
      return;
    }
    const hideId = target.closest<HTMLElement>('[data-hide]')?.dataset.hide;
    if (hideId) {
      const set = hiddenIds();
      if (set.has(hideId)) set.delete(hideId);
      else set.add(hideId);
      app.set({ hidden: [...set] });
      render();
      return;
    }
    const delId = target.closest<HTMLElement>('[data-del]')?.dataset.del;
    if (!delId) return;
    if (confirmId !== delId) {
      confirmId = delId;
      render();
      return;
    }
    try {
      await api.deleteVideo(delId);
      confirmId = null;
      toast('已从片库删除');
      await load();
    } catch (err) {
      toast(errorMessage(err));
    }
  };

  r.probe.onclick = async () => {
    if (!items.length) return;
    r.probe.disabled = true;
    items.forEach((v) => probes.set(v.id, 'pending'));
    render();
    await runLimited(items, 3, async (v) => {
      // B 站视频在跨域播放器里，没法用 <video> 试探
      if (isBilibili(v.src)) return void probes.delete(v.id), render();
      probes.set(v.id, await probeSources([v.src, ...(v.mirrors ?? [])]));
      render();
    });
    r.probe.disabled = false;
    const ok = [...probes.values()].filter((p) => p !== 'pending' && p.ok).length;
    toast(`检测完成：${ok} / ${items.length} 部在你的网络下可以播放`);
  };

  const srcInput = view.querySelector<HTMLInputElement>('#add-src')!;
  srcInput.addEventListener('input', () => {
    const bili = !!parseBilibili(srcInput.value) || isB23Short(srcInput.value);
    r.biliFields.hidden = !bili;
    view.querySelectorAll<HTMLElement>('[data-direct]').forEach((n) => (n.hidden = bili));
    const ref = parseBilibili(srcInput.value);
    if (ref) {
      const from = view.querySelector<HTMLInputElement>('#add-ep-from')!;
      const to = view.querySelector<HTMLInputElement>('#add-ep-to')!;
      if (!from.value) from.value = String(ref.page);
      if (!to.value) to.value = String(ref.page);
    }
  });

  const renderBiliDeck = () => {
    const on = app.get().bilibiliInDeck;
    r.biliDeck.textContent = on ? 'B 站卡：在牌堆' : 'B 站卡：不进牌堆';
    r.biliDeck.setAttribute('aria-pressed', String(on));
  };
  renderBiliDeck();
  r.biliDeck.onclick = () => {
    app.set({ bilibiliInDeck: !app.get().bilibiliInDeck });
    renderBiliDeck();
    toast(app.get().bilibiliInDeck ? 'B 站卡片会出现在抽卡里（实验）' : '抽卡只抽站内影片');
  };

  r.toggleAdd.onclick = () => {
    r.form.hidden = !r.form.hidden;
    if (!r.form.hidden) view.querySelector<HTMLInputElement>('#add-src')!.focus();
  };

  // 字幕文件读入对应文本框
  r.form.addEventListener('change', async (e) => {
    const fileInput = e.target as HTMLInputElement;
    const lang = fileInput.dataset.file;
    const file = fileInput.files?.[0];
    if (!lang || !file) return;
    view.querySelector<HTMLTextAreaElement>(`#add-sub-${lang}`)!.value = await file.text();
  });

  /** B 站：一个链接按集数范围拆成多条，每集一张卡 */
  const addBilibili = async (val: (id: string) => string) => {
    if (isB23Short(val('add-src'))) {
      r.error.textContent = 'b23.tv 短链接无法识别，请在浏览器打开后复制地址栏里的完整链接（含 BV 号）';
      return;
    }
    const ref = parseBilibili(val('add-src'))!;
    const from = Number.parseInt(val('add-ep-from') || String(ref.page), 10);
    const to = Number.parseInt(val('add-ep-to') || String(from), 10);
    const titleZh = val('add-title-zh');
    const series = val('add-series') || titleZh;
    r.error.textContent =
      !titleZh ? '请填写中文标题' : !(from >= 1 && to >= from) ? '集数范围不对' : to - from >= 100 ? '一次最多添加 100 集' : '';
    if (r.error.textContent) return;
    const titleDe = val('add-title-de') || titleZh;
    const many = to > from;
    await busy(r.submit, '保存中…', async () => {
      for (let p = from; p <= to; p++) {
        await api.addVideo({
          src: bilibiliPageUrl({ ...ref, page: p }),
          titleZh: many ? `${titleZh} 第 ${p} 集` : titleZh,
          titleDe: many ? `${titleDe} – Folge ${p}` : titleDe,
          ...(val('add-title-en') ? { titleEn: many ? `${val('add-title-en')} – Episode ${p}` : val('add-title-en') } : {}),
          series,
          episode: p,
          tags: ['B站', '我的'],
        });
      }
    });
    r.form.reset();
    srcInput.dispatchEvent(new Event('input'));
    r.form.hidden = true;
    toast(many ? `已添加「${series}」第 ${from}–${to} 集` : '已添加到片库');
    await load();
  };

  r.form.onsubmit = async (e) => {
    e.preventDefault();
    const val = (id: string) => view.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)!.value.trim();
    if (!r.biliFields.hidden) {
      try {
        await addBilibili(val);
      } catch (err) {
        r.error.textContent = errorMessage(err);
      }
      return;
    }
    const mirrors = val('add-mirrors')
      .split(/\s+/)
      .filter(Boolean);
    const payload: NewVideoInput = {
      src: val('add-src'),
      ...(mirrors.length ? { mirrors } : {}),
      titleZh: val('add-title-zh'),
      titleDe: val('add-title-de'),
      ...(val('add-title-en') ? { titleEn: val('add-title-en') } : {}),
      ...(val('add-poster') ? { poster: val('add-poster') } : {}),
      subtitlesZh: val('add-sub-zh'),
      subtitlesDe: val('add-sub-de'),
      subtitlesEn: val('add-sub-en'),
    };
    const links = [payload.src, ...mirrors];
    r.error.textContent = links.some((l) => !externalSource(l))
      ? '视频链接必须是 http(s) 开头的外部链接'
      : links.some((l) => isBlockedMixedContent(l, location.protocol))
        ? '本站是 https，浏览器会拦截 http 视频，请换成 https 链接'
        : !payload.titleZh || !payload.titleDe
        ? '请填写中文和德语标题'
        : '';
    if (r.error.textContent) return;
    try {
      await busy(r.submit, '保存中…', () => api.addVideo(payload));
      r.form.reset();
      r.form.hidden = true;
      toast('已添加到片库');
      await load();
    } catch (err) {
      r.error.textContent = errorMessage(err);
    }
  };

  void load();
  let lastLib = app.get().secondLang;
  const offLib = app.subscribe((st) => {
    if (st.secondLang === lastLib) return;
    lastLib = st.secondLang;
    render();
  });
  const offTopbar = bindLibraryThemeSwitch(r.topbar);
  return () => {
    offLib();
    offTopbar();
  };
}
