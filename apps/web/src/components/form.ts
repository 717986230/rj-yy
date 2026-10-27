import { ApiError } from '@vido/shared';
import { esc } from '../app/dom';
import { icon, type IconName } from './icons';

export function field({
  id,
  label,
  type = 'text',
  iconName,
  placeholder = '',
  value = '',
  autocomplete = 'off',
  toggle = false,
}: {
  id: string;
  label: string;
  type?: string;
  iconName: IconName;
  placeholder?: string;
  value?: string;
  autocomplete?: string;
  toggle?: boolean;
}): string {
  return `
    <label class="block" for="${id}">
      <span class="sr-only">${esc(label)}</span>
      <span class="field">
        <span class="text-mute">${icon(iconName, 'h-[18px] w-[18px]')}</span>
        <input id="${id}" name="${id}" type="${type}" placeholder="${esc(placeholder)}" value="${esc(value)}" autocomplete="${autocomplete}" />
        ${toggle ? `<button type="button" class="text-mute hover:text-fg" data-toggle="${id}" aria-label="显示密码">${icon('eye', 'h-[18px] w-[18px]')}</button>` : ''}
      </span>
    </label>`;
}

/** 绑定"显示/隐藏密码"按钮 */
export function bindPasswordToggles(root: HTMLElement): void {
  root.querySelectorAll<HTMLButtonElement>('[data-toggle]').forEach((btn) => {
    btn.onclick = () => {
      const input = root.querySelector<HTMLInputElement>(`#${btn.dataset.toggle}`)!;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = icon(show ? 'eyeOff' : 'eye', 'h-[18px] w-[18px]');
      btn.setAttribute('aria-label', show ? '隐藏密码' : '显示密码');
    };
  });
}

export const errorMessage = (e: unknown) => (e instanceof ApiError ? e.message : '出了点问题，请稍后再试');

/** 提交时禁用按钮并显示加载文字 */
export async function busy<T>(button: HTMLButtonElement, label: string, task: () => Promise<T>): Promise<T> {
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<span class="spinner !h-4 !w-4 !border-2"></span>${esc(label)}`;
  try {
    return await task();
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
}
