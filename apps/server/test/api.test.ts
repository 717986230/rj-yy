import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { SEED_VIDEOS } from '@vido/shared';
import { createApp } from '../src/app';
import { loadConfig } from '../src/config';
import { openDatabase } from '../src/db';

const config = { ...loadConfig({ NODE_ENV: 'test' }), databaseFile: ':memory:' };
let app: ReturnType<typeof createApp>;

beforeEach(() => {
  app = createApp(openDatabase(':memory:'), config);
});

async function signUp(email = 'otti@vido.app', password = 'otter2026') {
  const res = await request(app).post('/api/auth/register').send({ email, password });
  expect(res.status).toBe(201);
  return res.body.token as string;
}

describe('auth', () => {
  it('registers, logs in and reads the profile', async () => {
    await signUp('Otti@Vido.app');
    const login = await request(app).post('/api/auth/login').send({ email: 'otti@vido.app', password: 'otter2026' });
    expect(login.status).toBe(200);
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
    expect(me.body).toMatchObject({ email: 'otti@vido.app', name: 'otti' });
  });

  it('rejects duplicates, weak passwords and wrong passwords', async () => {
    await signUp();
    expect((await request(app).post('/api/auth/register').send({ email: 'otti@vido.app', password: 'otter2026' })).status).toBe(409);
    const weak = await request(app).post('/api/auth/register').send({ email: 'a@b.cn', password: 'short' });
    expect(weak.status).toBe(400);
    expect(weak.body.message).toContain('8');
    expect((await request(app).post('/api/auth/login').send({ email: 'otti@vido.app', password: 'nope' })).status).toBe(401);
  });

  it('resets a password once with the emailed token', async () => {
    await signUp();
    const forgot = await request(app).post('/api/auth/forgot').send({ email: 'otti@vido.app' });
    const token = forgot.body.devToken as string;
    expect(token).toBeTruthy();
    expect((await request(app).post('/api/auth/reset').send({ token, password: 'newpass99' })).status).toBe(204);
    expect((await request(app).post('/api/auth/reset').send({ token, password: 'newpass99' })).status).toBe(400);
    expect((await request(app).post('/api/auth/login').send({ email: 'otti@vido.app', password: 'newpass99' })).status).toBe(200);
  });

  it('does not reveal unknown emails', async () => {
    const res = await request(app).post('/api/auth/forgot').send({ email: 'ghost@vido.app' });
    expect(res.status).toBe(200);
    expect(res.body.devToken).toBeUndefined();
  });
});

describe('videos', () => {
  it('requires a session', async () => {
    expect((await request(app).get('/api/videos')).status).toBe(401);
  });

  it('lists the built-in library and returns full subtitles per video', async () => {
    const token = await signUp();
    const list = await request(app).get('/api/videos').set('Authorization', `Bearer ${token}`);
    expect(list.body).toHaveLength(SEED_VIDEOS.length);
    expect(list.body[0]).not.toHaveProperty('subtitles');
    // B 站条目的字幕在视频画面里，不在片库数据里
    const bili = list.body.find((v: { source: string }) => v.source === 'bilibili.com');
    expect(bili).toMatchObject({ series: expect.any(String), episode: 1, hasSubtitles: false });
    const one = await request(app).get(`/api/videos/${list.body[0].id}`).set('Authorization', `Bearer ${token}`);
    expect(one.body.subtitles.zh.length).toBeGreaterThan(0);
    const vtt = await request(app).get(`/api/videos/${list.body[0].id}/subtitles/en.vtt`).set('Authorization', `Bearer ${token}`);
    expect(vtt.headers['content-type']).toContain('text/vtt');
    expect(vtt.text.startsWith('WEBVTT')).toBe(true);
  });

  it('adds a private external video with pasted subtitles and deletes it', async () => {
    const a = await signUp('a@vido.app');
    const b = await signUp('b@vido.app');
    const created = await request(app)
      .post('/api/videos')
      .set('Authorization', `Bearer ${a}`)
      .send({
        titleZh: '我的片子',
        titleDe: 'Mein Film',
        src: 'https://example.com/movie.mp4',
        mirrors: ['https://mirror.example.cn/movie.mp4'],
        subtitlesZh: 'WEBVTT\n\n00:00:01.000 --> 00:00:03.000\n你好',
        subtitlesDe: '1\n00:00:01,000 --> 00:00:03,000\nHallo',
        subtitlesEn: '00:00:01.000 --> 00:00:03.000\nHello',
      });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ source: 'example.com', mirrors: ['https://mirror.example.cn/movie.mp4'], subtitles: { zh: [{ text: '你好' }], de: [{ text: 'Hallo' }], en: [{ text: 'Hello' }] } });
    const id = created.body.id;
    expect((await request(app).get(`/api/videos/${id}`).set('Authorization', `Bearer ${b}`)).status).toBe(404);
    expect((await request(app).delete(`/api/videos/${SEED_VIDEOS[0]!.id}`).set('Authorization', `Bearer ${a}`)).status).toBe(403);
    expect((await request(app).delete(`/api/videos/${id}`).set('Authorization', `Bearer ${a}`)).status).toBe(204);
  });

  it('rejects non-http links', async () => {
    const token = await signUp();
    const res = await request(app)
      .post('/api/videos')
      .set('Authorization', `Bearer ${token}`)
      .send({ titleZh: 'x', titleDe: 'x', src: 'file:///C:/movie.mp4' });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('外部链接');
  });
});
