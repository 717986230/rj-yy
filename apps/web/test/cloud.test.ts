import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/app/site', () => ({ HANDBOOK: true, HANDBOOK_HOME: '/', mediaUrl: (u: string) => u }));

/** 假的手册后端 /api/vido：rev 冲突时返回 409 和服务端版本 */
function fakeServer(initial: { rev: number; document: unknown } = { rev: 0, document: null }) {
  const db = { ...initial };
  const calls: { method: string; body?: any }[] = [];
  const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
    const method = init.method ?? 'GET';
    const auth = (init.headers as Record<string, string>).Authorization;
    if (auth !== 'Bearer tok') return new Response(JSON.stringify({ err: '未登录' }), { status: 401 });
    if (method === 'GET') {
      calls.push({ method });
      return new Response(JSON.stringify(db));
    }
    const body = JSON.parse(init.body as string);
    calls.push({ method, body });
    if (body.rev !== db.rev) return new Response(JSON.stringify({ err: '同步冲突', ...db }), { status: 409 });
    db.rev += 1;
    db.document = body.document;
    return new Response(JSON.stringify({ ok: 1, rev: db.rev }));
  });
  vi.stubGlobal('fetch', fetchMock);
  return { db, calls };
}

const video = (id: string) => ({ id, title: { zh: id, de: id, en: id }, src: 'https://x/' + id + '.mp4', ownerId: 'someone' });

async function load() {
  vi.resetModules();
  const cloud = await import('../src/services/cloud');
  const { app } = await import('../src/app/state');
  app.set({ user: { id: 'me', email: 'demo@vido.app', name: '演示', createdAt: '' } as never });
  return { cloud, app };
}

const flush = () => vi.advanceTimersByTimeAsync(1000);

describe('跟手册账号同步', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('没登录手册时完全不联网', async () => {
    const { calls } = fakeServer();
    const { cloud } = await load();
    await cloud.startCloudSync();
    cloud.schedulePush();
    await flush();
    expect(calls).toEqual([]);
  });

  it('第一次同步：本机和云端取并集，再推上去', async () => {
    localStorage.setItem('acct_token', 'tok');
    localStorage.setItem('acct_user', JSON.stringify({ username: 'xl' }));
    localStorage.setItem('vido.local.videos', JSON.stringify([video('mine')]));
    localStorage.setItem('vido.prefs', JSON.stringify({ hidden: ['a'] }));
    const { db } = fakeServer({ rev: 3, document: { hidden: ['b'], videos: [video('cloud')] } });
    const { cloud, app } = await load();
    await cloud.startCloudSync();
    expect(app.get().hidden).toEqual(['a', 'b']);
    const local = JSON.parse(localStorage.getItem('vido.local.videos')!);
    expect(local.map((v: any) => v.id)).toEqual(['mine', 'cloud']);
    expect(local.every((v: any) => v.ownerId === 'me')).toBe(true);
    await flush();
    expect(db.rev).toBe(4);
    expect((db.document as any).hidden).toEqual(['a', 'b']);
  });

  it('同步过之后：以云端为准，别的设备取消隐藏也能带过来', async () => {
    localStorage.setItem('acct_token', 'tok');
    localStorage.setItem('acct_user', JSON.stringify({ username: 'xl' }));
    localStorage.setItem('vido.prefs', JSON.stringify({ hidden: ['a', 'b'] }));
    localStorage.setItem('vido.cloud.rev', JSON.stringify({ account: 'xl', rev: 4 }));
    const { calls } = fakeServer({ rev: 5, document: { hidden: ['b'], videos: [] } });
    const { cloud, app } = await load();
    await cloud.startCloudSync();
    expect(app.get().hidden).toEqual(['b']);
    await flush();
    expect(calls.filter((c) => c.method === 'PUT')).toEqual([]);
  });

  it('隐藏一张卡就推上去；遇到别的设备先写了，合并后重试', async () => {
    localStorage.setItem('acct_token', 'tok');
    const { db } = fakeServer({ rev: 1, document: { hidden: [], videos: [] } });
    const { cloud, app } = await load();
    await cloud.startCloudSync();
    await flush();
    // 别的设备抢先写了一版
    db.rev = 2;
    db.document = { hidden: ['other'], videos: [] };
    app.set({ hidden: ['x'] });
    await flush();
    expect(db.rev).toBe(3);
    expect((db.document as any).hidden).toEqual(['x', 'other']);
    expect(app.get().hidden).toEqual(['x', 'other']);
  });

  it('手册登录过期（401）时静默退回本地', async () => {
    localStorage.setItem('acct_token', 'expired');
    localStorage.setItem('vido.prefs', JSON.stringify({ hidden: ['a'] }));
    fakeServer();
    const { cloud, app } = await load();
    await expect(cloud.startCloudSync()).resolves.toBeUndefined();
    expect(app.get().hidden).toEqual(['a']);
  });
});
