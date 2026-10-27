import { checkPassword, isEmail } from '@vido/shared';
import { el, refs } from '../app/dom';
import type { RouteContext } from '../app/router';
import { app } from '../app/state';
import { bindPasswordToggles, busy, errorMessage, field } from '../components/form';
import { icon } from '../components/icons';
import { otter } from '../components/otter';
import { toast } from '../components/toast';
import { api, DEMO_ACCOUNT } from '../services/api';

const brand = `
  <div class="flex items-center gap-2">
    <span class="grid h-8 w-8 place-items-center rounded-xl bg-aqua text-aqua-ink">${icon('cards', 'h-[18px] w-[18px]')}</span>
    <span class="font-display text-xl font-semibold tracking-wide">Vido</span>
  </div>`;

const backBar = (title: string) => `
  <div class="flex items-center gap-1">
    <a href="#/login" class="icon-btn -ml-2" aria-label="返回登录">${icon('back')}</a>
    <h1 class="text-lg font-bold">${title}</h1>
  </div>`;

function modeNote(): string {
  return api.kind === 'local'
    ? '本地模式：账号仅保存在当前浏览器'
    : '已连接 Vido 服务器';
}

// ---------------------------------------------------------------- 登录

export function loginPage(root: HTMLElement, { navigate }: RouteContext) {
  const local = api.kind === 'local';
  const view = el(`
    <section class="screen scroll-area">
      ${brand}
      <div class="relative mx-auto mt-2 flex h-[34%] min-h-[150px] w-full items-end justify-center">
        <div class="absolute bottom-3 h-40 w-40 rounded-full bg-aqua/15 blur-2xl"></div>
        ${otter({ pose: 'wave', cls: 'relative h-full w-auto' })}
        <div class="absolute right-[6%] top-[8%] rounded-2xl rounded-bl-sm border border-line/15 bg-raised px-3 py-1.5 font-display text-sm text-cream shadow-soft">Hallo! 你好！</div>
      </div>
      <h1 class="mt-3 text-[26px] font-bold leading-tight">欢迎回来</h1>
      <p class="mt-1 text-sm text-mute">登录后继续抽卡，一张卡就是一整部片</p>
      <form data-ref="form" class="mt-5 grid gap-3" novalidate>
        ${field({ id: 'login-email', label: '邮箱', type: 'email', iconName: 'mail', placeholder: '邮箱', value: local ? DEMO_ACCOUNT.email : '', autocomplete: 'email' })}
        ${field({ id: 'login-password', label: '密码', type: 'password', iconName: 'lock', placeholder: '密码', value: local ? DEMO_ACCOUNT.password : '', autocomplete: 'current-password', toggle: true })}
        <div class="flex items-center justify-between px-1 text-[13px]">
          <p data-ref="error" class="field-error"></p>
          <a href="#/forgot" class="shrink-0 text-mute hover:text-fg">忘记密码？</a>
        </div>
        <button data-ref="submit" class="btn-primary w-full">登录</button>
      </form>
      <p class="mt-4 text-center text-sm text-mute">还没有账号？<a href="#/register" class="link">立即注册</a></p>
      <p class="mt-auto pt-4 text-center text-[11px] text-mute/70">${local ? `演示账号已预填：${DEMO_ACCOUNT.email} / ${DEMO_ACCOUNT.password} · ` : ''}${modeNote()}</p>
    </section>`);
  const r = refs<{ form: HTMLFormElement; error: HTMLElement; submit: HTMLButtonElement }>(view);
  bindPasswordToggles(view);

  r.form.onsubmit = async (e) => {
    e.preventDefault();
    const email = (view.querySelector('#login-email') as HTMLInputElement).value;
    const password = (view.querySelector('#login-password') as HTMLInputElement).value;
    r.error.textContent = !isEmail(email) ? '请输入正确的邮箱' : !password ? '请输入密码' : '';
    if (r.error.textContent) return;
    try {
      const session = await busy(r.submit, '登录中…', () => api.login({ email, password }));
      app.set({ user: session.user });
      navigate('/play');
    } catch (err) {
      r.error.textContent = errorMessage(err);
    }
  };
  root.append(view);
}

// ---------------------------------------------------------------- 注册

export function registerPage(root: HTMLElement, { navigate }: RouteContext) {
  const view = el(`
    <section class="screen scroll-area">
      ${backBar('创建账号')}
      <div class="mt-4 flex items-center gap-3 rounded-3xl border border-line/10 bg-panel/70 p-3">
        ${otter({ cls: 'h-20 w-16 shrink-0' })}
        <p class="text-sm leading-relaxed text-mute">注册后，你添加的 B 站视频、外链视频和字幕会保存在自己的片库里。</p>
      </div>
      <form data-ref="form" class="mt-5 grid gap-3" novalidate>
        ${field({ id: 'reg-name', label: '昵称', iconName: 'user', placeholder: '昵称（可选）', autocomplete: 'nickname' })}
        ${field({ id: 'reg-email', label: '邮箱', type: 'email', iconName: 'mail', placeholder: '邮箱', autocomplete: 'email' })}
        ${field({ id: 'reg-password', label: '密码', type: 'password', iconName: 'lock', placeholder: '密码（至少 8 位，含字母和数字）', autocomplete: 'new-password', toggle: true })}
        ${field({ id: 'reg-confirm', label: '确认密码', type: 'password', iconName: 'lock', placeholder: '再输入一次密码', autocomplete: 'new-password' })}
        <p data-ref="error" class="field-error"></p>
        <button data-ref="submit" class="btn-primary w-full">注册并登录</button>
      </form>
      <p class="mt-4 text-center text-sm text-mute">已有账号？<a href="#/login" class="link">去登录</a></p>
    </section>`);
  const r = refs<{ form: HTMLFormElement; error: HTMLElement; submit: HTMLButtonElement }>(view);
  bindPasswordToggles(view);
  const val = (id: string) => (view.querySelector(`#${id}`) as HTMLInputElement).value;

  r.form.onsubmit = async (e) => {
    e.preventDefault();
    const email = val('reg-email');
    const password = val('reg-password');
    r.error.textContent = !isEmail(email)
      ? '请输入正确的邮箱'
      : (checkPassword(password) ?? (password !== val('reg-confirm') ? '两次输入的密码不一致' : ''));
    if (r.error.textContent) return;
    try {
      const session = await busy(r.submit, '注册中…', () => api.register({ email, password, name: val('reg-name') }));
      app.set({ user: session.user });
      toast(`注册成功，欢迎你 ${session.user.name}`);
      navigate('/play');
    } catch (err) {
      r.error.textContent = errorMessage(err);
    }
  };
  root.append(view);
}

// ---------------------------------------------------------------- 忘记密码

export function forgotPage(root: HTMLElement, { navigate }: RouteContext) {
  const view = el(`
    <section class="screen scroll-area">
      ${backBar('找回密码')}
      <p class="mt-4 text-sm leading-relaxed text-mute">输入注册邮箱，我们会发送一个重置密码的链接，30 分钟内有效。</p>
      <form data-ref="form" class="mt-5 grid gap-3" novalidate>
        ${field({ id: 'forgot-email', label: '邮箱', type: 'email', iconName: 'mail', placeholder: '注册邮箱', autocomplete: 'email' })}
        <p data-ref="error" class="field-error"></p>
        <button data-ref="submit" class="btn-primary w-full">发送重置链接</button>
      </form>
      <div data-ref="result" hidden class="mt-5 rounded-2xl border border-aqua/25 bg-aqua/10 p-4 text-sm leading-relaxed"></div>
      <div class="mt-auto flex justify-center pt-6 opacity-80">${otter({ cls: 'h-36 w-28' })}</div>
    </section>`);
  const r = refs<{ form: HTMLFormElement; error: HTMLElement; submit: HTMLButtonElement; result: HTMLElement }>(view);

  r.form.onsubmit = async (e) => {
    e.preventDefault();
    const email = (view.querySelector('#forgot-email') as HTMLInputElement).value;
    r.error.textContent = isEmail(email) ? '' : '请输入正确的邮箱';
    if (r.error.textContent) return;
    try {
      const res = await busy(r.submit, '发送中…', () => api.requestPasswordReset(email));
      r.result.hidden = false;
      r.result.textContent = res.message;
      if (res.devToken) {
        const token = res.devToken;
        const go = el<HTMLButtonElement>(`<button class="btn-ghost mt-3 w-full">演示：打开重置链接</button>`);
        go.onclick = () => navigate(`/reset/${encodeURIComponent(token)}`);
        r.result.append(el('<p class="mt-2 text-xs text-mute">当前没有邮件服务，重置链接直接显示在这里。</p>'), go);
      }
    } catch (err) {
      r.error.textContent = errorMessage(err);
    }
  };
  root.append(view);
}

// ---------------------------------------------------------------- 重置密码

export function resetPage(root: HTMLElement, { params, navigate }: RouteContext) {
  const token = params[0] ?? '';
  const view = el(`
    <section class="screen scroll-area">
      ${backBar('设置新密码')}
      <form data-ref="form" class="mt-6 grid gap-3" novalidate>
        ${field({ id: 'reset-password', label: '新密码', type: 'password', iconName: 'lock', placeholder: '新密码（至少 8 位，含字母和数字）', autocomplete: 'new-password', toggle: true })}
        ${field({ id: 'reset-confirm', label: '确认新密码', type: 'password', iconName: 'lock', placeholder: '再输入一次', autocomplete: 'new-password' })}
        <p data-ref="error" class="field-error">${token ? '' : '链接缺少重置令牌，请重新申请'}</p>
        <button data-ref="submit" class="btn-primary w-full" ${token ? '' : 'disabled'}>保存新密码</button>
      </form>
    </section>`);
  const r = refs<{ form: HTMLFormElement; error: HTMLElement; submit: HTMLButtonElement }>(view);
  bindPasswordToggles(view);

  r.form.onsubmit = async (e) => {
    e.preventDefault();
    const pw = (view.querySelector('#reset-password') as HTMLInputElement).value;
    const confirm = (view.querySelector('#reset-confirm') as HTMLInputElement).value;
    r.error.textContent = checkPassword(pw) ?? (pw !== confirm ? '两次输入的密码不一致' : '');
    if (r.error.textContent) return;
    try {
      await busy(r.submit, '保存中…', () => api.resetPassword(token, pw));
      toast('密码已更新，请用新密码登录');
      navigate('/login', { replace: true });
    } catch (err) {
      r.error.textContent = errorMessage(err);
    }
  };
  root.append(view);
}
