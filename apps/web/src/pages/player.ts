import { Playlist, type PlayMode, type SecondaryLang, type Video, type VideoSummary } from '@vido/shared';
import { el, esc, formatTime, on, refs, wait, type Cleanup } from '../app/dom';
import type { RouteContext } from '../app/router';
import { app } from '../app/state';
import { errorMessage } from '../components/form';
import { icon } from '../components/icons';
import { otter } from '../components/otter';
import { SubtitleOverlay } from '../components/subtitles';
import { toast } from '../components/toast';
import { showDiagnostics } from '../components/diagnostics';
import { showWelcome } from '../components/welcome';
import { api } from '../services/api';
import { VideoEngine, type PlayerStatus } from '../services/player';

const MODES: Array<{ id: PlayMode; label: string; icon: 'repeat' | 'shuffle' | 'cards'; hint: string }> = [
  { id: 'sequential', label: '顺序循环', icon: 'repeat', hint: '顺序循环：播完自动翻开下一张，到最后一张后回到第一张' },
  { id: 'shuffle', label: '随机播放', icon: 'shuffle', hint: '随机播放：播完自动随机翻下一张，一轮内不重复' },
  { id: 'manual', label: '手动抽卡', icon: 'cards', hint: '手动抽卡：每部播完停下，由你来抽下一张' },
];

const LANGS: Array<{ id: SecondaryLang; label: string }> = [
  { id: 'de', label: '中·德' },
  { id: 'en', label: '中·英' },
];

const TURN_MS = 310;
const SHUFFLE_MS = 460;

type Refs = {
  wrap: HTMLElement;
  card: HTMLElement;
  back: HTMLElement;
  backHint: HTMLElement;
  backCount: HTMLElement;
  front: HTMLElement;
  video: HTMLVideoElement;
  tap: HTMLElement;
  subs: HTMLElement;
  loading: HTMLElement;
  loadingNote: HTMLElement;
  failed: HTMLElement;
  sound: HTMLButtonElement;
  failList: HTMLElement;
  failNote: HTMLElement;
  ended: HTMLElement;
  fullscreen: HTMLButtonElement;
  no: HTMLElement;
  titleZh: HTMLElement;
  titleSecond: HTMLElement;
  source: HTMLElement;
  dur: HTMLElement;
  cur: HTMLElement;
  total: HTMLElement;
  seek: HTMLInputElement;
  modes: HTMLElement;
  cc: HTMLButtonElement;
  langs: HTMLElement;
  tune: HTMLButtonElement;
  tunePanel: HTMLElement;
  offset: HTMLElement;
  mute: HTMLButtonElement;
  volume: HTMLInputElement;
  prev: HTMLButtonElement;
  play: HTMLButtonElement;
  next: HTMLButtonElement;
  draw: HTMLButtonElement;
  library: HTMLAnchorElement;
  help: HTMLButtonElement;
  diag: HTMLButtonElement;
  logout: HTMLButtonElement;
};

export function playerPage(root: HTMLElement, { navigate }: RouteContext): Cleanup {
  const view = el(`
    <section class="screen gap-3">
      <header class="flex items-center justify-between">
        <button data-ref="diag" class="flex items-center gap-2 text-left" title="播放诊断">
          <span class="grid h-8 w-8 place-items-center rounded-xl bg-aqua text-aqua-ink">${icon('cards', 'h-[18px] w-[18px]')}</span>
          <span class="grid leading-none">
            <span class="font-display text-xl font-semibold tracking-wide">Vido</span>
            <span class="mt-0.5 text-[9px] tabular-nums text-mute">${__APP_VERSION__.split(' · ')[0]} · 诊断</span>
          </span>
        </button>
        <nav class="flex items-center">
          <a data-ref="library" href="#/library" class="icon-btn" aria-label="片库" title="片库">${icon('library')}</a>
          <button data-ref="help" class="icon-btn" aria-label="玩法介绍" title="玩法介绍">${icon('help')}</button>
          <button data-ref="logout" class="icon-btn" aria-label="退出登录" title="退出登录">${icon('logout')}</button>
        </nav>
      </header>

      <div data-ref="modes" class="seg grid-cols-3" role="group" aria-label="播放模式">
        ${MODES.map((m) => `<button data-mode="${m.id}" aria-pressed="false">${icon(m.icon, 'h-4 w-4')}${m.label}</button>`).join('')}
      </div>

      <div class="deck">
        <div data-ref="wrap" class="card-wrap">
          <div data-ref="card" class="card">
            <button data-ref="back" class="card-face card-back flex flex-col items-center justify-center gap-2 text-center" aria-label="抽一张卡">
              <span class="font-display text-[11px] font-semibold uppercase tracking-[0.35em] text-aqua/80">Vido · Karte</span>
              ${otter({ cls: 'h-[46%] w-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]' })}
              <span data-ref="backHint" class="hint mt-1 text-base font-bold text-fg">点我抽一张</span>
              <span data-ref="backCount" class="text-xs text-mute">片库加载中…</span>
            </button>

            <div data-ref="front" class="card-face card-front flex flex-col">
              <div class="relative min-h-0 flex-1 bg-black">
                <video data-ref="video" class="absolute inset-0 h-full w-full object-contain" playsinline webkit-playsinline x5-playsinline x5-video-player-type="h5-page" preload="auto"></video>
                <div data-ref="tap" class="absolute inset-0" aria-hidden="true"></div>
                <div data-ref="subs"></div>
                <div data-ref="loading" class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3" hidden><span class="spinner"></span><p data-ref="loadingNote" class="max-w-[85%] truncate rounded-full bg-black/50 px-3 py-1 text-[11px] text-mute"></p></div>
                <div data-ref="failed" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 p-6 text-center" hidden>
                  <p class="text-sm font-bold">这部视频的外链都打不开</p>
                  <ul data-ref="failList" class="grid max-w-full gap-1 text-left text-[11px] leading-snug text-mute"></ul>
                  <p data-ref="failNote" class="text-[11px] text-cream/80"></p>
                  <div class="flex gap-2">
                    <button data-action="retry" class="btn-ghost h-9 px-3">${icon('refresh', 'h-4 w-4')}重试</button>
                    <button data-action="skip" class="btn-ghost h-9 px-3">${icon('cards', 'h-4 w-4')}换一张</button>
                  </div>
                </div>
                <div data-ref="ended" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center" hidden>
                  <p class="text-sm font-bold">这一部看完啦</p>
                  <div class="flex gap-2">
                    <button data-action="replay" class="btn-ghost h-9 px-3">${icon('refresh', 'h-4 w-4')}重播</button>
                    <button data-action="draw" class="btn-primary h-9 px-4 text-sm">${icon('cards', 'h-4 w-4')}再抽一张</button>
                  </div>
                </div>
                <button data-ref="sound" class="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-aqua px-5 py-3 text-sm font-bold text-ink shadow-lg" hidden>${icon('volume', 'h-5 w-5')}<span>点击开启声音</span></button>
                <button data-ref="fullscreen" class="icon-btn absolute right-1.5 top-1.5 h-8 w-8 bg-black/40" aria-label="全屏">${icon('expand', 'h-4 w-4')}</button>
              </div>
              <div class="grid gap-1 bg-panel px-3.5 py-3">
                <div class="flex items-center justify-between gap-2">
                  <span data-ref="no" class="font-display text-[11px] font-semibold tracking-widest text-aqua"></span>
                  <span data-ref="dur" class="text-[11px] tabular-nums text-mute"></span>
                </div>
                <p data-ref="titleZh" class="truncate text-[15px] font-bold"></p>
                <div class="flex items-center justify-between gap-2">
                  <p data-ref="titleSecond" class="min-w-0 truncate pr-1 text-xs italic text-cream/80"></p>
                  <span data-ref="source" class="chip max-w-[55%] shrink-0 truncate"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-1.5">
        <div class="flex items-center gap-2 text-[11px] tabular-nums text-mute">
          <span data-ref="cur" class="w-10">0:00</span>
          <input data-ref="seek" id="seek" type="range" class="range min-w-0 flex-1" min="0" max="1000" value="0" step="1" aria-label="播放进度" disabled />
          <span data-ref="total" class="w-10 text-right">--:--</span>
        </div>

        <div class="relative flex items-center gap-1">
          <button data-ref="cc" class="icon-btn" aria-pressed="true" aria-label="字幕开关" title="字幕开关">${icon('cc')}</button>
          <div data-ref="langs" class="seg grid-cols-2 !p-0.5" role="group" aria-label="字幕语言">
            ${LANGS.map((l) => `<button data-lang="${l.id}" class="!h-7 px-2.5 !text-xs" aria-pressed="false">${l.label}</button>`).join('')}
          </div>
          <button data-ref="tune" class="icon-btn" aria-label="字幕时间微调" title="字幕时间微调" aria-expanded="false">${icon('sliders')}</button>
          <div class="ml-auto flex items-center">
            <button data-ref="mute" class="icon-btn" aria-label="静音">${icon('volume')}</button>
            <input data-ref="volume" id="volume" type="range" class="range w-20" min="0" max="100" aria-label="音量" />
          </div>
          <div data-ref="tunePanel" class="absolute bottom-full left-0 z-20 mb-2 w-60 rounded-2xl border border-line/15 bg-raised p-3 shadow-soft" hidden>
            <p class="text-xs text-mute">字幕和画面对不上时，微调字幕时间</p>
            <div class="mt-2 flex items-center justify-between">
              <button data-offset="-0.5" class="btn-ghost h-8 px-3 text-xs">提前 0.5 秒</button>
              <span data-ref="offset" class="text-sm tabular-nums">0.0s</span>
              <button data-offset="0.5" class="btn-ghost h-8 px-3 text-xs">延后 0.5 秒</button>
            </div>
            <button data-offset="reset" class="mt-2 w-full text-xs text-aqua">恢复默认</button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button data-ref="prev" class="icon-btn h-11 w-11" aria-label="上一部">${icon('prev')}</button>
          <button data-ref="play" class="grid h-14 w-14 place-items-center rounded-full bg-fg text-deep shadow-soft transition active:scale-95 disabled:opacity-40" aria-label="播放" disabled>${icon('play', 'h-6 w-6')}</button>
          <button data-ref="next" class="icon-btn h-11 w-11" aria-label="下一部">${icon('next')}</button>
          <button data-ref="draw" class="btn-primary ml-auto h-12 flex-1">${icon('cards')}抽一张卡</button>
        </div>
      </div>
    </section>`);

  const r = refs<Refs>(view);
  root.append(view);

  const engine = new VideoEngine(r.video);
  const overlay = new SubtitleOverlay(r.subs);
  const cleanups: Cleanup[] = [];
  const cache = new Map<string, Video>();
  let summaries: VideoSummary[] = [];
  const playlist = new Playlist([], app.get().mode);
  let flipping = false;
  let alive = true;

  // ---------------- 片库 ----------------

  const fetchVideo = async (id: string) => {
    const hit = cache.get(id);
    if (hit) return hit;
    const v = await api.getVideo(id);
    cache.set(id, v);
    return v;
  };

  const loadLibrary = async () => {
    try {
      summaries = await api.listVideos();
      playlist.setIds(summaries.map((s) => s.id));
      r.backCount.textContent = `片库 ${summaries.length} 部 · 站内 + 外链`;
    } catch (err) {
      r.backCount.textContent = errorMessage(err);
    }
  };

  // ---------------- 翻牌 ----------------

  const fillFront = (v: Video) => {
    const index = summaries.findIndex((s) => s.id === v.id);
    r.no.textContent = `No.${String(index + 1).padStart(2, '0')} / ${String(summaries.length).padStart(2, '0')}`;
    r.titleZh.textContent = v.title.zh;
    r.source.innerHTML = `${icon('link', 'h-3 w-3')}${esc(v.source)}`;
    r.dur.textContent = v.duration ? formatTime(v.duration) : '';
    renderTitleSecond();
    overlay.clear();
  };

  const renderTitleSecond = () => {
    const v = engine.item;
    if (v) r.titleSecond.textContent = v.title[app.get().secondLang];
  };

  /** 翻牌：转到侧面 → 换面 → 转回正面；结束后卡片没有任何 transform */
  const turn = async (toFront: boolean) => {
    r.card.classList.add('turn-out');
    await wait(TURN_MS);
    r.card.classList.toggle('is-front', toFront);
    r.card.classList.replace('turn-out', 'turn-in');
    void r.card.offsetWidth;
    r.card.classList.remove('turn-in');
    await wait(TURN_MS);
  };

  /** 翻开一张卡：已翻开时先翻回背面，洗牌，再翻到正面并开始加载外链 */
  const present = async (id: string | null) => {
    if (!id || flipping) return;
    flipping = true;
    try {
      const pending = fetchVideo(id);
      engine.unload();
      // 仍在点击的同步阶段：先解锁媒体播放，翻牌动画结束后才能有声播放（iOS 等）
      engine.unlock();
      showOverlay(null);
      r.sound.hidden = true;
      if (r.card.classList.contains('is-front')) await turn(false);
      r.wrap.classList.add('is-shuffling');
      await wait(SHUFFLE_MS);
      r.wrap.classList.remove('is-shuffling');
      const video = await pending;
      if (!alive) return;
      engine.load(video, { autoplay: false });
      fillFront(video);
      await turn(true);
      if (!alive) return;
      void engine.play();
    } catch (err) {
      toast(errorMessage(err));
    } finally {
      flipping = false;
    }
  };

  // 第一张固定是站内托管的开场片：不依赖外链，任何网络下都能先看到画面、听到声音
  let firstCard = true;
  const opening = () => {
    const first = firstCard && playlist.current === null ? summaries[0]?.id : undefined;
    firstCard = false;
    return first ? playlist.select(first) : null;
  };
  const draw = () => present(opening() ?? playlist.draw());
  const next = () => present(opening() ?? playlist.next());
  const prev = () => {
    const id = playlist.prev();
    if (id) void present(id);
    else toast('前面没有了，抽一张新的吧');
  };

  // ---------------- 状态 → 界面 ----------------

  const showSoundButton = (label: string) => {
    r.sound.querySelector('span')!.textContent = label;
    r.sound.hidden = false;
  };

  const showOverlay = (which: 'loading' | 'failed' | 'ended' | null) => {
    r.loading.hidden = which !== 'loading';
    r.failed.hidden = which !== 'failed';
    r.ended.hidden = which !== 'ended';
  };

  const onStatus = (s: PlayerStatus) => {
    const playing = s === 'playing' || s === 'loading';
    r.play.innerHTML = icon(playing && !engine.paused ? 'pause' : 'play', 'h-6 w-6');
    r.play.setAttribute('aria-label', playing && !engine.paused ? '暂停' : '播放');
    r.play.disabled = s === 'idle';
    r.seek.disabled = s === 'idle';
    showOverlay(s === 'loading' ? 'loading' : s === 'error' ? 'failed' : s === 'ended' && playlist.mode === 'manual' ? 'ended' : null);
    if (s === 'ended') {
      const action = playlist.onEnded();
      if (action.type === 'advance') void present(action.id);
    }
    if (s === 'error') renderFailures();
  };

  /** 所有线路都失败：列出每条线路和原因；自动模式下几秒后换下一张 */
  let skipTimer = 0;
  const renderFailures = () => {
    r.failList.innerHTML = engine.sourceFailures
      .map((f, i) => `<li><b class="text-fg">${i === 0 ? '主线路' : `备用 ${i}`} · ${esc(f.host)}</b><br />${esc(f.reason)}</li>`)
      .join('');
    clearTimeout(skipTimer);
    if (playlist.mode === 'manual') {
      r.failNote.textContent = '可以重试，或换一张；也可以在片库里添加你能访问的视频链接。';
      return;
    }
    r.failNote.textContent = '4 秒后自动播放下一张';
    const failedItem = engine.item;
    skipTimer = window.setTimeout(() => {
      if (alive && engine.state === 'error' && engine.item === failedItem) void next();
    }, 4000);
  };

  let seeking = false;
  const onTime = (t: number, d: number) => {
    const s = app.get();
    overlay.update(engine.item?.subtitles ?? null, t, { visible: s.subtitles, second: s.secondLang, offset: s.subtitleOffset });
    r.cur.textContent = formatTime(t);
    r.total.textContent = d ? formatTime(d) : '--:--';
    if (!seeking) {
      const pct = d ? (t / d) * 100 : 0;
      r.seek.value = String(Math.round(pct * 10));
      r.seek.style.setProperty('--fill', `${pct}%`);
    }
  };

  const renderPrefs = () => {
    const s = app.get();
    r.modes.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === s.mode)));
    r.langs.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === s.secondLang)));
    r.cc.setAttribute('aria-pressed', String(s.subtitles));
    r.offset.textContent = `${s.subtitleOffset > 0 ? '+' : ''}${s.subtitleOffset.toFixed(1)}s`;
    r.backHint.textContent = s.mode === 'manual' ? '点我抽一张' : '点我开始播放';
    r.draw.innerHTML = `${icon('cards')}${s.mode === 'manual' ? '抽一张卡' : '换一张'}`;
    renderTitleSecond();
    onTime(engine.time, engine.duration);
  };

  const renderVolume = (volume: number, muted: boolean) => {
    const v = muted ? 0 : Math.round(volume * 100);
    r.volume.value = String(v);
    r.volume.style.setProperty('--fill', `${v}%`);
    r.mute.innerHTML = icon(muted || volume === 0 ? 'mute' : 'volume');
    r.mute.setAttribute('aria-label', muted ? '取消静音' : '静音');
  };

  // ---------------- 事件 ----------------

  cleanups.push(
    engine.on('status', onStatus),
    engine.on('time', onTime),
    engine.on('volume', (volume, muted) => {
      renderVolume(volume, muted);
      if (!muted) r.sound.hidden = true;
      app.set({ volume });
    }),
    engine.on('source', (url, index, total) => {
      const host = url.replace(/^https?:\/\//, '').split('/')[0];
      r.loadingNote.textContent = index === 0 ? `正在连接 ${host}` : `主线路不通，正在尝试备用线路 ${index}/${total - 1} · ${host}`;
    }),
    engine.on('autoplayMuted', () => showSoundButton('点击开启声音')),
    engine.on('playBlocked', () => showSoundButton('点击播放')),
    app.subscribe(renderPrefs),
  );

  // 左右滑动卡片：左滑下一部，右滑上一部。拖动时卡片跟手，松手后滑出再翻下一张。
  let swipe: { id: number; x: number; y: number; dx: number; locked: boolean | null } | null = null;
  let swiped = false;
  r.wrap.style.touchAction = 'pan-y';
  r.wrap.addEventListener('pointerdown', (e) => {
    if (flipping || (e.target as HTMLElement).closest('button:not([data-ref="back"]), input')) return;
    swipe = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, locked: null };
  });
  r.wrap.addEventListener('pointermove', (e) => {
    if (!swipe || e.pointerId !== swipe.id) return;
    const dx = e.clientX - swipe.x;
    const dy = e.clientY - swipe.y;
    if (swipe.locked === null && Math.hypot(dx, dy) > 10) swipe.locked = Math.abs(dx) > Math.abs(dy);
    if (!swipe.locked) return;
    swipe.dx = dx;
    r.card.style.transition = 'none';
    r.card.style.transform = `translateX(${dx}px) rotate(${dx / 30}deg)`;
  });
  const endSwipe = async (e: PointerEvent) => {
    if (!swipe || e.pointerId !== swipe.id) return;
    const { dx, locked } = swipe;
    swipe = null;
    if (!locked) return;
    swiped = true;
    setTimeout(() => (swiped = false), 50);
    r.card.style.transition = 'transform 0.22s ease-out, opacity 0.22s ease-out';
    if (Math.abs(dx) < 70 || e.type === 'pointercancel') {
      r.card.style.transform = '';
      setTimeout(() => (r.card.style.transition = ''), 230);
      return;
    }
    const dir = dx < 0 ? -1 : 1;
    r.card.style.transform = `translateX(${dir * 120}%) rotate(${dir * 12}deg)`;
    r.card.style.opacity = '0';
    await wait(220);
    // 新卡从另一侧滑入，再按原流程翻开
    r.card.style.transition = 'none';
    r.card.style.transform = `translateX(${-dir * 60}%)`;
    void r.card.offsetWidth;
    r.card.style.transition = 'transform 0.22s ease-out, opacity 0.22s ease-out';
    r.card.style.transform = '';
    r.card.style.opacity = '';
    setTimeout(() => (r.card.style.transition = ''), 230);
    if (dir < 0) void (app.get().mode === 'manual' ? draw() : next());
    else prev();
  };
  r.wrap.addEventListener('pointerup', (e) => void endSwipe(e));
  r.wrap.addEventListener('pointercancel', (e) => void endSwipe(e));

  r.back.onclick = () => {
    if (!swiped) void (app.get().mode === 'manual' ? draw() : next());
  };
  r.tap.onclick = () => {
    if (!swiped) engine.toggle();
  };
  r.sound.onclick = () => {
    r.sound.hidden = true;
    engine.setMuted(false);
    void engine.play();
  };
  r.play.onclick = () => engine.toggle();
  r.prev.onclick = prev;
  r.next.onclick = () => void (app.get().mode === 'manual' ? draw() : next());
  r.draw.onclick = () => void draw();

  r.failed.querySelector<HTMLButtonElement>('[data-action="retry"]')!.onclick = () => {
    clearTimeout(skipTimer);
    engine.reload();
  };
  r.failed.querySelector<HTMLButtonElement>('[data-action="skip"]')!.onclick = () => void draw();
  r.ended.querySelector<HTMLButtonElement>('[data-action="replay"]')!.onclick = () => {
    engine.seek(0);
    void engine.play();
  };
  r.ended.querySelector<HTMLButtonElement>('[data-action="draw"]')!.onclick = () => void draw();

  r.modes.onclick = (e) => {
    const mode = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-mode]')?.dataset.mode as PlayMode | undefined;
    if (!mode || mode === app.get().mode) return;
    playlist.setMode(mode);
    app.set({ mode });
    toast(MODES.find((m) => m.id === mode)!.hint);
  };
  r.langs.onclick = (e) => {
    const lang = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-lang]')?.dataset.lang as SecondaryLang | undefined;
    if (lang) app.set({ secondLang: lang });
  };
  r.cc.onclick = () => app.set({ subtitles: !app.get().subtitles });
  r.tune.onclick = () => {
    r.tunePanel.hidden = !r.tunePanel.hidden;
    r.tune.setAttribute('aria-expanded', String(!r.tunePanel.hidden));
  };
  r.tunePanel.onclick = (e) => {
    const step = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-offset]')?.dataset.offset;
    if (!step) return;
    const next = step === 'reset' ? 0 : Math.round((app.get().subtitleOffset + Number(step)) * 10) / 10;
    app.set({ subtitleOffset: Math.max(-10, Math.min(10, next)) });
  };

  r.seek.addEventListener('input', () => {
    seeking = true;
    const pct = Number(r.seek.value) / 10;
    r.seek.style.setProperty('--fill', `${pct}%`);
    r.cur.textContent = formatTime((pct / 100) * engine.duration);
  });
  r.seek.addEventListener('change', () => {
    engine.seek((Number(r.seek.value) / 1000) * engine.duration);
    seeking = false;
  });

  r.volume.addEventListener('input', () => engine.setVolume(Number(r.volume.value) / 100));
  r.mute.onclick = () => engine.setMuted(!r.video.muted);

  r.fullscreen.onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await r.front.requestFullscreen();
    } catch {
      // iOS Safari 不支持元素全屏，退回视频原生全屏
      (r.video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen?.();
    }
  };

  r.help.onclick = () => showWelcome({ onStart: () => void draw() });
  r.diag.onclick = () => showDiagnostics(r.video);
  r.logout.onclick = async () => {
    await api.logout();
    app.set({ user: null });
    navigate('/login');
  };

  cleanups.push(
    on(document, 'keydown', (e) => {
      if ((e.target as HTMLElement).closest('input, textarea')) return;
      if (e.key === ' ') {
        e.preventDefault();
        engine.toggle();
      } else if (e.key === 'ArrowRight') engine.seek(engine.time + 5);
      else if (e.key === 'ArrowLeft') engine.seek(engine.time - 5);
      else if (e.key.toLowerCase() === 'n') void next();
      else if (e.key.toLowerCase() === 'd') void draw();
      else if (e.key.toLowerCase() === 'c') app.set({ subtitles: !app.get().subtitles });
    }),
  );

  // ---------------- 启动 ----------------

  const s = app.get();
  r.video.volume = s.volume;
  renderVolume(s.volume, false);
  renderPrefs();

  void loadLibrary().then(() => {
    const pending = app.get().pendingVideoId;
    if (pending && alive) {
      app.set({ pendingVideoId: null });
      void present(playlist.select(pending));
    }
  });

  return () => {
    alive = false;
    clearTimeout(skipTimer);
    cleanups.forEach((c) => c());
    engine.destroy();
  };
}
