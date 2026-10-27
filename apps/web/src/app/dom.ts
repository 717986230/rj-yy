/** 极简的 DOM 工具：模板字符串生成元素，按 data-ref 收集引用 */

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function esc(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ESC[c]!);
}

/** 把一段 HTML 变成单个元素（模板里的插值请先用 esc 转义） */
export function el<T extends HTMLElement = HTMLElement>(html: string): T {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild as T;
}

/** 收集 [data-ref] 元素，返回 { name: element } */
export function refs<T extends Record<string, HTMLElement>>(root: HTMLElement): T {
  const out: Record<string, HTMLElement> = {};
  root.querySelectorAll<HTMLElement>('[data-ref]').forEach((n) => {
    out[n.dataset.ref!] = n;
  });
  return out as T;
}

export type Cleanup = () => void;

/** 绑定事件并返回解绑函数，便于页面卸载时统一清理 */
export function on<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Document | Window,
  type: K,
  handler: (e: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): Cleanup {
  target.addEventListener(type, handler as EventListener, options);
  return () => target.removeEventListener(type, handler as EventListener, options);
}

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--';
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}
