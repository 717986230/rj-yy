import { externalSource, isBlockedMixedContent } from '@vido/shared';

export interface ProbeResult {
  ok: boolean;
  /** 能播放的那条链接的域名，或最后一条失败的原因 */
  detail: string;
}

const TIMEOUT_MS = 10_000;

/** 用一个不挂到页面上的 <video> 只加载元数据，判断当前网络能否打开这条链接 */
export function probeUrl(url: string, timeout = TIMEOUT_MS): Promise<ProbeResult> {
  if (isBlockedMixedContent(url, location.protocol)) {
    return Promise.resolve({ ok: false, detail: 'http 链接会被 https 页面拦截' });
  }
  return new Promise((resolve) => {
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.muted = true;
    const done = (r: ProbeResult) => {
      clearTimeout(timer);
      v.removeAttribute('src');
      v.load();
      resolve(r);
    };
    const timer = window.setTimeout(() => done({ ok: false, detail: `${TIMEOUT_MS / 1000} 秒内没有响应` }), timeout);
    v.onloadedmetadata = () => done({ ok: true, detail: externalSource(url) ?? url });
    v.onerror = () => done({ ok: false, detail: '打不开（被墙、防盗链、已失效或格式不支持）' });
    v.src = url;
  });
}

/** 依次检测主链接与备用链接，有一条能打开即为可播放 */
export async function probeSources(sources: string[]): Promise<ProbeResult> {
  let last: ProbeResult = { ok: false, detail: '没有链接' };
  for (const url of sources) {
    last = await probeUrl(url);
    if (last.ok) return last;
  }
  return last;
}

/** 以有限并发运行任务 */
export async function runLimited<T>(items: T[], limit: number, task: (item: T) => Promise<void>): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) await task(queue.shift()!);
  });
  await Promise.all(workers);
}
