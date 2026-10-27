import { el, esc } from '../app/dom';

let timer = 0;

export function toast(message: string, ms = 2600): void {
  const root = document.getElementById('toast-root');
  if (!root) return;
  clearTimeout(timer);
  root.replaceChildren(
    el(`<div class="toast rounded-2xl border border-line/15 bg-raised/95 px-4 py-2.5 text-center text-sm text-fg shadow-soft">${esc(message)}</div>`),
  );
  timer = window.setTimeout(() => root.replaceChildren(), ms);
}
