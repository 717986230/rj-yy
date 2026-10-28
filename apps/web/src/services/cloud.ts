import type { Video } from '@vido/shared';
import { app } from '../app/state';
import { HANDBOOK } from '../app/site';
import { storage } from '../app/storage';

/**
 * 跟手册账号同步：隐藏的卡片 + 自己加的视频。
 *
 * Vido 没有自己的后端也不用登录，数据默认只在本机。在 www.uuoo.site/vido/ 打开、
 * 并且在手册里登录过（同域 localStorage 里有 acct_token）时，这两样存进手册后端的
 * /api/vido，换设备也在。任何失败都静默退回纯本地，不影响看视频。
 */

const API = 'https://uuoo-analytics.uuoo.workers.dev/api/vido';
const VIDEOS_KEY = 'vido.local.videos';
const REV_KEY = 'vido.cloud.rev';

/** 云端的数据写进本机后在 window 上派发，片库页据此刷新 */
export const CLOUD_SYNCED = 'vido:cloud-synced';

interface Doc {
  hidden: string[];
  videos: Video[];
}

const token = (): string | null => {
  if (!HANDBOOK) return null;
  try {
    return localStorage.getItem('acct_token');
  } catch {
    return null;
  }
};

const localDoc = (): Doc => ({ hidden: app.get().hidden, videos: storage.get<Video[]>(VIDEOS_KEY, []) });

/** 本机上次和哪个手册账号、同步到哪个版本 */
const account = (): string => {
  try {
    return JSON.parse(localStorage.getItem('acct_user') || '{}').username || '?';
  } catch {
    return '?';
  }
};
const getRev = (): number => {
  const r = storage.get<{ account?: string; rev?: number }>(REV_KEY, {});
  return r.account === account() ? (r.rev ?? 0) : 0;
};
const setRev = (rev: number) => storage.set(REV_KEY, { account: account(), rev });

const clean = (d: Partial<Doc> | null | undefined): Doc => ({
  hidden: Array.isArray(d?.hidden) ? d.hidden.filter((x) => typeof x === 'string') : [],
  videos: Array.isArray(d?.videos) ? d.videos.filter((v) => v && typeof v.id === 'string') : [],
});

/** 两边取并集；同一个视频以本地为准 */
function merge(local: Doc, remote: Doc): Doc {
  const ids = new Set(local.videos.map((v) => v.id));
  return {
    hidden: [...new Set([...local.hidden, ...remote.hidden])],
    videos: [...local.videos, ...remote.videos.filter((v) => !ids.has(v.id))],
  };
}

/** a 里的每一项 b 都有 */
const covers = (b: Doc, a: Doc) => {
  const h = new Set(b.hidden);
  const v = new Set(b.videos.map((x) => x.id));
  return a.hidden.every((x) => h.has(x)) && a.videos.every((x) => v.has(x.id));
};

function applyLocal(doc: Doc): void {
  // 片库按 ownerId 过滤，云端来的视频归到本机这个（免登录的）用户名下
  const ownerId = app.get().user?.id;
  storage.set(VIDEOS_KEY, ownerId ? doc.videos.map((v) => ({ ...v, ownerId })) : doc.videos);
  const cur = app.get().hidden;
  if (cur.length !== doc.hidden.length || cur.some((x, i) => x !== doc.hidden[i])) app.set({ hidden: doc.hidden });
  window.dispatchEvent(new Event(CLOUD_SYNCED));
}

async function call(method: 'GET' | 'PUT', body?: unknown): Promise<{ status: number; data: any }> {
  const res = await fetch(API, {
    method,
    headers: { Authorization: `Bearer ${token()}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

let pushing: Promise<void> | null = null;
let again = false;

async function pushNow(): Promise<void> {
  let doc = localDoc();
  for (let attempt = 0; attempt < 3; attempt++) {
    const { status, data } = await call('PUT', { rev: getRev(), document: doc });
    if (status === 200) {
      setRev(data.rev);
      return;
    }
    if (status !== 409) return;
    // 别的设备先写了：合并服务端版本后重试
    setRev(data.rev ?? 0);
    doc = merge(doc, clean(data.document));
    applyLocal(doc);
  }
}

/** 本地改了隐藏或片库后调用；合并成一次上传 */
export function schedulePush(): void {
  if (!token()) return;
  if (pushing) {
    again = true;
    return;
  }
  pushing = new Promise<void>((r) => setTimeout(r, 800))
    .then(pushNow)
    .catch(() => {})
    .finally(() => {
      pushing = null;
      if (again) {
        again = false;
        schedulePush();
      }
    });
}

/** 启动时拉一次，合并后如有本地独有的再推回去；之后隐藏卡片一变就同步 */
export async function startCloudSync(): Promise<void> {
  if (!token()) return;
  try {
    const { status, data } = await call('GET');
    if (status !== 200) return; // 401：手册登录已过期；404：手册后端还没部署这个接口
    const remote = clean(data.document);
    // 本机已经和这个账号同步过：云端就是最新（本机的改动当时已经推上去了），整份照搬，
    // 这样别的设备上「取消隐藏 / 删掉视频」也能带过来。第一次同步才把本机已有的并进去。
    const synced = getRev() > 0 && data.document;
    const next = synced ? remote : merge(localDoc(), remote);
    setRev(data.rev ?? 0);
    applyLocal(next);
    if (!data.document || !covers(remote, next)) schedulePush();
  } catch {
    return;
  }
  let hidden = app.get().hidden;
  app.subscribe((s) => {
    if (s.hidden === hidden) return;
    hidden = s.hidden;
    schedulePush();
  });
}
