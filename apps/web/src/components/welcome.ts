import { el, refs } from '../app/dom';
import { welcome } from '../app/state';
import { icon } from './icons';
import { openModal } from './modal';
import { otter } from './otter';

/**
 * 首次打开 App 自动弹出的欢迎卡：小獭 Otti 打招呼，介绍抽卡看片的玩法。
 * onStart 由当前页面决定（未登录时去登录，已登录时直接抽第一张卡）。
 */
export function showWelcome({ onStart, startLabel = '开始抽卡' }: { onStart?: () => void; startLabel?: string } = {}) {
  const card = el(`
    <div class="relative w-full max-w-[340px] rounded-[28px] border border-line/15 bg-panel px-6 pb-6 pt-24 text-center shadow-soft">
      <div class="absolute -top-20 left-1/2 -translate-x-1/2">
        <div class="absolute inset-x-4 bottom-2 top-10 rounded-full bg-aqua/20 blur-2xl"></div>
        ${otter({ pose: 'wave', cls: 'relative h-44 w-36' })}
      </div>
      <button data-ref="close" class="icon-btn absolute right-3 top-3 text-mute" aria-label="关闭">${icon('x')}</button>
      <p class="font-display text-sm font-semibold tracking-wide text-aqua">Hallo! Hello! 你好！</p>
      <h2 class="mt-1 text-[22px] font-bold" style="text-wrap:balance">我是小獭 Otti，欢迎来到 Vido</h2>
      <p class="mt-2 text-sm leading-relaxed text-mute">这里的每一张卡都是<b class="text-fg">一整部视频</b>，视频来自外部网站的公开链接。翻开一张，就从头看到尾。</p>
      <ul class="mt-4 grid gap-2 text-left text-[13px]">
        <li class="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3 py-2.5">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-aqua/15 text-aqua">${icon('cards', 'h-4 w-4')}</span>
          <span><b>手动抽卡</b><span class="text-mute"> · 点一下，翻开一部随机视频</span></span>
        </li>
        <li class="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3 py-2.5">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-aqua/15 text-aqua">${icon('repeat', 'h-4 w-4')}</span>
          <span><b>顺序循环</b><span class="text-mute"> / </span><b>随机播放</b><span class="text-mute"> · 播完自动翻下一张</span></span>
        </li>
        <li class="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-3 py-2.5">
          <span class="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-aqua/15 text-aqua">${icon('cc', 'h-4 w-4')}</span>
          <span><b>双语字幕</b><span class="text-mute"> · 中文在上，德语或英语在下，实时同步</span></span>
        </li>
      </ul>
      <button data-ref="start" class="btn-primary mt-5 w-full" autofocus>${startLabel}</button>
      <button data-ref="later" class="mt-2 h-10 w-full text-sm text-mute hover:text-fg">先随便看看</button>
    </div>`);

  const r = refs<{ close: HTMLButtonElement; start: HTMLButtonElement; later: HTMLButtonElement }>(card);
  const close = openModal(card, { onClose: welcome.markSeen });
  r.close.onclick = close;
  r.later.onclick = close;
  r.start.onclick = () => {
    close();
    onStart?.();
  };
  return close;
}
