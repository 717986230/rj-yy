import type { ApiClient } from '@vido/shared';
import { HttpApi } from './http';
import { LocalApi } from './local';

export { DEMO_ACCOUNT } from './local';

const base = import.meta.env.VITE_API_BASE?.trim();

/** 构建时决定数据来源：配置了 VITE_API_BASE 就连后端，否则使用浏览器本地存储 */
export const api: ApiClient = base ? new HttpApi(base) : new LocalApi();

export async function prepareApi(): Promise<void> {
  if (api instanceof LocalApi) await api.ensureDemoAccount();
}
