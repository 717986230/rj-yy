import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SEED_VIDEOS } from '@vido/shared';
import app from '../src/index';
import type { Env } from '../src/env';
import { memoryD1 } from './d1';

let env: Env;

beforeEach(() => {
  env = { DB: memoryD1(), JWT_SECRET: 'test-secret', CORS_ORIGIN: 'https://717986230.github.io', EXPOSE_RESET_TOKEN: '1' };
});

async function call(method: string, path: string, { body, token }: { body?: unknown; token?: string } = {}) {
  const res = await app.request(
    `/api${path}`,
    {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    env,
  );
  const text = await res.text();
  let json: any = text;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, body: json, headers: res.headers };
}

async function signUp(email = 'otti@vido.app', password = 'otter2026') {
  const res = await call('POST', '/auth/register', { body: { email, password } });
  expect(res.status).toBe(201);
  return res.body.token as string;
}

describe('auth', () => {
  it('registers, logs in and reads the profile', async () => {
    await signUp('Otti@Vido.app');
    const login = await call('POST', '/auth/login', { body: { email: 'otti@vido.app', password: 'otter2026' } });
    expect(login.status).toBe(200);
    const me = await call('GET', '/auth/me', { token: login.body.token });
    expect(me.body).toMatchObject({ email: 'otti@vido.app', name: 'otti' });
  });

  it('rejects duplicates, weak passwords, wrong passwords and forged tokens', async () => {
    await signUp();
    expect((await call('POST', '/auth/register', { body: { email: 'otti@vido.app', password: 'otter2026' } })).status).toBe(409);
    const weak = await call('POST', '/auth/register', { body: { email: 'a@b.cn', password: 'short' } });
    expect(weak.status).toBe(400);
    expect(weak.body.message).toContain('8');
    expect((await call('POST', '/auth/login', { body: { email: 'otti@vido.app', password: 'nope' } })).status).toBe(401);
    const token = await signUp('b@vido.app');
    const forged = token.slice(0, -2) + (token.endsWith('AA') ? 'BB' : 'AA');
    expect((await call('GET', '/auth/me', { token: forged })).status).toBe(401);
  });

  it('resets a password once with the token', async () => {
    await signUp();
    const forgot = await call('POST', '/auth/forgot', { body: { email: 'otti@vido.app' } });
    const token = forgot.body.devToken as string;
    expect(token).toBeTruthy();
    expect((await call('POST', '/auth/reset', { body: { token, password: 'newpass99' } })).status).toBe(204);
    expect((await call('POST', '/auth/reset', { body: { token, password: 'newpass99' } })).status).toBe(400);
    expect((await call('POST', '/auth/login', { body: { email: 'otti@vido.app', password: 'newpass99' } })).status).toBe(200);
  });

  it('never hands out reset tokens in production', async () => {
    delete env.EXPOSE_RESET_TOKEN;
    await signUp();
    const res = await call('POST', '/auth/forgot', { body: { email: 'otti@vido.app' } });
    expect(res.status).toBe(200);
    expect(res.body.devToken).toBeUndefined();
  });

  it('rejects malformed JSON', async () => {
    const res = await app.request('/api/auth/login', { method: 'POST', body: '{', headers: { 'Content-Type': 'application/json' } }, env);
    expect(res.status).toBe(400);
  });
});

describe('videos', () => {
  it('requires a session', async () => {
    expect((await call('GET', '/videos')).status).toBe(401);
  });

  it('lists the built-in library plus own videos, isolated per user', async () => {
    const a = await signUp('a@vido.app');
    const b = await signUp('b@vido.app');
    const added = await call('POST', '/videos', {
      token: a,
      body: { titleZh: '测试', titleDe: 'Test', src: 'https://example.com/a.mp4', subtitlesZh: '1\n00:00:01,000 --> 00:00:02,000\n你好\n' },
    });
    expect(added.status).toBe(201);
    const listA = await call('GET', '/videos', { token: a });
    expect(listA.body).toHaveLength(SEED_VIDEOS.length + 1);
    expect(listA.body.at(-1)).toMatchObject({ id: added.body.id, hasSubtitles: true });
    expect(listA.body.at(-1).subtitles).toBeUndefined();
    expect((await call('GET', '/videos', { token: b })).body).toHaveLength(SEED_VIDEOS.length);
    expect((await call('GET', `/videos/${added.body.id}`, { token: b })).status).toBe(404);
    const vtt = await call('GET', `/videos/${added.body.id}/subtitles/zh.vtt`, { token: a });
    expect(vtt.body).toContain('WEBVTT');
    expect(vtt.body).toContain('你好');
    expect((await call('DELETE', `/videos/${added.body.id}`, { token: b })).status).toBe(404);
    expect((await call('DELETE', `/videos/${added.body.id}`, { token: a })).status).toBe(204);
    expect((await call('GET', '/videos', { token: a })).body).toHaveLength(SEED_VIDEOS.length);
  });

  it('serves built-in videos with their subtitle files but refuses to delete them', async () => {
    const token = await signUp();
    const seed = SEED_VIDEOS[0]!;
    const got = await call('GET', `/videos/${seed.id}`, { token });
    expect(got.body).toMatchObject({ id: seed.id, src: seed.src });
    expect((await call('DELETE', `/videos/${seed.id}`, { token })).status).toBe(403);
  });

  it('validates new videos', async () => {
    const token = await signUp();
    const res = await call('POST', '/videos', { token, body: { titleZh: 'x', titleDe: 'x', src: 'javascript:alert(1)' } });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('视频链接');
  });
});

describe('cors', () => {
  it('answers preflight for the site origin only', async () => {
    const ok = await app.request('/api/videos', { method: 'OPTIONS', headers: { Origin: 'https://717986230.github.io', 'Access-Control-Request-Method': 'GET' } }, env);
    expect(ok.headers.get('access-control-allow-origin')).toBe('https://717986230.github.io');
    const bad = await app.request('/api/videos', { method: 'OPTIONS', headers: { Origin: 'https://evil.example', 'Access-Control-Request-Method': 'GET' } }, env);
    expect(bad.headers.get('access-control-allow-origin')).toBeNull();
  });
});

describe('德语学习手册的账号（www.uuoo.site/vido/）', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('accepts a handbook session token and keeps a per-user library', async () => {
    env.UUOO_API = 'https://uuoo.test';
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const auth = new Headers(init?.headers).get('authorization');
      if (url === 'https://uuoo.test/api/me' && auth === 'Bearer hb-token') {
        return Response.json({ user: { username: 'xl', nickname: '小龙' } });
      }
      return Response.json({ err: '未登录' }, { status: 401 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const me = await call('GET', '/auth/me', { token: 'hb-token' });
    expect(me.status).toBe(200);
    expect(me.body).toMatchObject({ id: 'uuoo:xl', name: '小龙' });
    expect((await call('GET', '/auth/me', { token: 'other-token' })).status).toBe(401);
    // 影子账号没有密码，不能用 Vido 的邮箱登录
    expect((await call('POST', '/auth/login', { body: { email: 'uuoo:xl', password: 'x' } })).status).toBe(400);
  });
});
