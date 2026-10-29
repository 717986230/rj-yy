import type { ApiClient } from '@vido/shared';
import { DEMO_ACCOUNT, LocalApi } from './local';

/**
 * 不需要账号：自己添加的视频、隐藏的卡片都存在当前浏览器里。
 * 打开时自动进入一个本机账号，用户看不到登录页。
 */
const local = new LocalApi();
export const api: ApiClient = local;

export async function prepareApi(): Promise<void> {
  await local.ensureDemoAccount();
  if (!(await local.me())) await local.login(DEMO_ACCOUNT);
}
