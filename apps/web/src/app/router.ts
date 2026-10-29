import type { Cleanup } from './dom';

/**
 * Hash 路由：#/play、#/library。
 * GitHub Pages 没有服务端重写，用 hash 保证刷新和分享链接都能打开。
 */
export interface RouteContext {
  params: string[];
  navigate: (path: string, opts?: { replace?: boolean }) => void;
}

export interface Route {
  path: string;
  /** 需要登录 */
  auth?: boolean;
  /** 已登录时跳走（登录、注册页） */
  guestOnly?: boolean;
  render: (root: HTMLElement, ctx: RouteContext) => Cleanup | void;
}

export function navigate(path: string, { replace = false } = {}): void {
  const hash = `#${path}`;
  if (replace) history.replaceState(null, '', hash);
  else if (location.hash !== hash) history.pushState(null, '', hash);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function startRouter(
  root: HTMLElement,
  routes: Route[],
  { isAuthed, home, login }: { isAuthed: () => boolean; home: string; login: string },
): void {
  let cleanup: Cleanup | void;

  const resolve = () => {
    const raw = location.hash.replace(/^#/, '') || home;
    const [, first = '', ...params] = raw.split('/');
    const route = routes.find((r) => r.path === `/${first}`);
    if (!route) return navigate(home, { replace: true });
    if (route.auth && !isAuthed()) return navigate(login, { replace: true });
    if (route.guestOnly && isAuthed()) return navigate(home, { replace: true });

    cleanup?.();
    root.replaceChildren();
    cleanup = route.render(root, { params: params.map(decodeURIComponent), navigate });
  };

  window.addEventListener('hashchange', resolve);
  resolve();
}
