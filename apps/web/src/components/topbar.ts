import type { SecondaryLang } from '@vido/shared';
import { app } from '../app/state';
import { icon } from './icons';

/**
 * 右上角的胶囊：中德 / 中英两个片库（同时决定第二字幕语言），旁边是明暗主题切换。
 * 播放页和片库页共用。
 */
export function libraryThemeSwitch(): string {
  return `
    <div class="flex items-center gap-1">
      <div class="seg grid-cols-2 !p-0.5" role="group" aria-label="片库语言">
        <button data-lib="de" class="!h-7 gap-0.5 whitespace-nowrap px-1.5 !text-xs" aria-pressed="false" title="中德片库：德语原声，中德字幕">🇩🇪<span>中德</span></button>
        <button data-lib="en" class="!h-7 gap-0.5 whitespace-nowrap px-1.5 !text-xs" aria-pressed="false" title="中英片库：英语原声，中英字幕">🇬🇧<span>中英</span></button>
      </div>
      <button data-theme-toggle class="icon-btn !h-8 !w-8" aria-label="明暗切换" title="明暗切换"></button>
    </div>`;
}

/** 绑定胶囊和主题按钮，返回解绑函数 */
export function bindLibraryThemeSwitch(root: HTMLElement): () => void {
  const render = () => {
    const { secondLang, theme } = app.get();
    root.querySelectorAll<HTMLButtonElement>('[data-lib]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lib === secondLang)));
    const toggle = root.querySelector<HTMLButtonElement>('[data-theme-toggle]');
    if (toggle) toggle.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon', 'h-[18px] w-[18px]');
  };
  const onClick = (e: Event) => {
    const target = e.target as HTMLElement;
    const lib = target.closest<HTMLElement>('[data-lib]')?.dataset.lib as SecondaryLang | undefined;
    if (lib && lib !== app.get().secondLang) app.set({ secondLang: lib });
    if (target.closest('[data-theme-toggle]')) app.set({ theme: app.get().theme === 'dark' ? 'light' : 'dark' });
  };
  root.addEventListener('click', onClick);
  const off = app.subscribe(render);
  render();
  return () => {
    root.removeEventListener('click', onClick);
    off();
  };
}
