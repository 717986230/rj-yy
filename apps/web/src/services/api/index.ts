import type { ApiClient } from '@vido/shared';
import { HttpApi } from './http';
import { LocalApi } from './local';
import { HANDBOOK } from '../../app/site';

export { DEMO_ACCOUNT } from './local';

// 在德语学习手册里打开时，后端就在同域的 /vido/api
const base = HANDBOOK ? `${location.origin}/vido/api` : import.meta.env.VITE_API_BASE?.trim();

/**
 * 构建时决定数据来源：配置了 VITE_API_BASE 就连后端（Cloudflare Worker），否则使用浏览器本地存储。
 * 后端连不上时（prepareApi 里检测）退回本地模式，保证应用总能打开。
 */
export let api: ApiClient = base ? new HttpApi(base) : new LocalApi();

const HEALTH_TIMEOUT_MS = 5000;

async function reachable(apiBase: string): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/health`, { signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function prepareApi(): Promise<void> {
  if (base && !(await reachable(base))) {
    console.warn('[vido] 后端连不上，改用本地模式');
    api = new LocalApi();
  }
  if (api instanceof LocalApi) await api.ensureDemoAccount();
}
