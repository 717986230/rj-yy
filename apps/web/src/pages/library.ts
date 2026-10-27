import { externalSource, type NewVideoInput, type VideoSummary } from '@vido/shared';
import { el, esc, formatTime, refs, type Cleanup } from '../app/dom';
import type { RouteContext } from '../app/router';
import { app } from '../app/state';
import { busy, errorMessage } from '../components/form';
import { icon } from '../components/icons';
import { toast } from '../components/toast';
import { api } from '../services/api';

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
        <button data-ref="toggleAdd" class="btn-ghost ml-auto h-9 px-3">${icon('plus', 'h-4 w-4')}添加外链</button>
      </div>
      <p class="text-xs text-mute">所有视频都从外部网站加载，应用不保存视频文件。点一部直接翻开播放。</p>

      <div class="scroll-area -mx-1 min-h-0 flex-1 px-1">
        <form data-ref="form" class="mb-4 grid gap-2.5 rounded-3xl border border-aqua/20 bg-aqua/[0.06] p-3.5" hidden novalidate>
          <p class="text-sm font-bold">添加一部外链视频</p>
          ${input('add-src', '视频直链 https://…/movie.mp4', 'url')}
          <div class="grid grid-cols-2 gap-2">
            ${input('add-title-zh', '中文标题')}
            ${input('add-title-de', 'Deutscher Titel')}
          </div>
          <div class="grid grid-cols-2 gap-2">
            ${input('add-title-en', 'English title（可选）')}
            ${input('add-poster', '封面图链接（可选）', 'url')}
          </div>
          ${subtitleInput('zh', '中文', SAMPLE_ZH)}
          ${subtitleInput('de', '德语', '00:00:01.000 --> 00:00:04.000\nErster deutscher Untertitel')}
          ${subtitleInput('en', '英语', '00:00:01.000 --> 00:00:04.000\nFirst English subtitle')}
          <p data-ref="error" class="field-error"></p>
          <button data-ref="submit" class="btn-primary w-full">保存到我的片库</button>
        </form>

        <ul data-ref="list" class="grid gap-2.5 pb-2">
          <li class="py-10 text-center text-sm text-mute">片库加载中…</li>
        </ul>
      </div>
    </section>`);

  const r = refs<{
    toggleAdd: HTMLButtonElement;
    form: HTMLFormElement;
    error: HTMLElement;
    submit: HTMLButtonElement;
    list: HTMLUListElement;
  }>(view);
  root.append(view);

  const userId = app.get().user?.id;
  let confirmId: string | null = null;

  const row = (v: VideoSummary, i: number) => {
    const mine = v.ownerId === userId;
    const thumb = v.poster
      ? `<img src="${esc(v.poster)}" alt="" loading="lazy" class="h-full w-full object-cover" onerror="this.remove()" />`
      : '';
    return `
      <li class="flex items-center gap-3 rounded-2xl border border-line/10 bg-panel p-2.5">
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
              <span class="chip max-w-[150px] truncate">${icon('link', 'h-3 w-3')}${esc(v.source)}</span>
              ${v.duration ? `<span class="chip tabular-nums">${formatTime(v.duration)}</span>` : ''}
              ${v.hasSubtitles ? '<span class="chip text-aqua">双语字幕</span>' : ''}
              ${mine ? '<span class="chip text-cream">我的</span>' : ''}
            </span>
          </span>
        </button>
        ${
          mine
            ? `<button data-del="${esc(v.id)}" class="icon-btn shrink-0 ${confirmId === v.id ? '!w-auto bg-coral/15 px-3 text-xs text-coral' : 'text-mute'}" aria-label="删除">${confirmId === v.id ? '确认删除' : icon('trash', 'h-4 w-4')}</button>`
            : ''
        }
      </li>`;
  };

  let items: VideoSummary[] = [];
  const render = () => {
    r.list.innerHTML = items.length
      ? items.map(row).join('')
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

  r.form.onsubmit = async (e) => {
    e.preventDefault();
    const val = (id: string) => view.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)!.value.trim();
    const payload: NewVideoInput = {
      src: val('add-src'),
      titleZh: val('add-title-zh'),
      titleDe: val('add-title-de'),
      ...(val('add-title-en') ? { titleEn: val('add-title-en') } : {}),
      ...(val('add-poster') ? { poster: val('add-poster') } : {}),
      subtitlesZh: val('add-sub-zh'),
      subtitlesDe: val('add-sub-de'),
      subtitlesEn: val('add-sub-en'),
    };
    r.error.textContent = !externalSource(payload.src)
      ? '视频链接必须是 http(s) 开头的外部链接'
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
  return () => undefined;
}
