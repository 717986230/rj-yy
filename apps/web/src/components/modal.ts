import { el } from '../app/dom';

/** 在舞台内打开一个居中弹层；返回关闭函数。点击遮罩或按 Esc 关闭。 */
export function openModal(content: HTMLElement, { onClose }: { onClose?: () => void } = {}): () => void {
  const root = document.getElementById('overlay-root')!;
  const backdrop = el(`<div class="backdrop" role="dialog" aria-modal="true"></div>`);
  content.classList.add('dialog');
  backdrop.append(content);
  root.append(backdrop);

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKey);
    backdrop.remove();
    onClose?.();
  };
  const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
  document.addEventListener('keydown', onKey);
  backdrop.addEventListener('click', (e) => e.target === backdrop && close());
  (content.querySelector<HTMLElement>('[autofocus]') ?? content.querySelector<HTMLElement>('button'))?.focus();
  return close;
}
