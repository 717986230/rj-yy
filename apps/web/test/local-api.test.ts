import { beforeEach, describe, expect, it } from 'vitest';
import { SEED_VIDEOS } from '@vido/shared';
import { DEMO_ACCOUNT, LocalApi } from '../src/services/api/local';

describe('LocalApi (GitHub Pages 模式)', () => {
  let api: LocalApi;
  beforeEach(() => {
    localStorage.clear();
    api = new LocalApi();
  });

  it('logs in with the demo account and restores the session', async () => {
    await api.ensureDemoAccount();
    const s = await api.login(DEMO_ACCOUNT);
    expect(s.user.email).toBe(DEMO_ACCOUNT.email);
    expect(JSON.stringify(localStorage)).not.toContain(DEMO_ACCOUNT.password);
    expect((await new LocalApi().me())?.id).toBe(s.user.id);
    await api.logout();
    expect(await api.me()).toBeNull();
  });

  it('validates registration like the server', async () => {
    await expect(api.register({ email: 'bad', password: 'otter2026' })).rejects.toThrow('邮箱');
    await expect(api.register({ email: 'a@b.cn', password: 'short' })).rejects.toThrow('8');
    await api.register({ email: 'a@b.cn', password: 'otter2026' });
    await expect(api.register({ email: 'A@B.cn', password: 'otter2026' })).rejects.toThrow('已注册');
    await expect(api.login({ email: 'a@b.cn', password: 'wrong1234' })).rejects.toThrow('不正确');
  });

  it('resets a password with a one-time token', async () => {
    await api.register({ email: 'a@b.cn', password: 'otter2026' });
    const { devToken } = await api.requestPasswordReset('a@b.cn');
    await api.resetPassword(devToken!, 'fresh2026');
    await expect(api.resetPassword(devToken!, 'again2026')).rejects.toThrow('无效');
    expect((await api.login({ email: 'a@b.cn', password: 'fresh2026' })).user.email).toBe('a@b.cn');
  });

  it('keeps custom external videos per user with parsed tri-lingual subtitles', async () => {
    await api.register({ email: 'a@b.cn', password: 'otter2026' });
    const v = await api.addVideo({
      src: 'https://example.com/a.mp4',
      titleZh: '甲',
      titleDe: 'A',
      subtitlesZh: '00:00:01.000 --> 00:00:02.000\n你好',
      subtitlesEn: '00:00:01.000 --> 00:00:02.000\nHello',
    });
    expect(v.subtitles.zh[0]?.text).toBe('你好');
    expect(v.subtitles.en[0]?.text).toBe('Hello');
    expect(v.title.en).toBe('A');
    expect(await api.listVideos()).toHaveLength(SEED_VIDEOS.length + 1);
    await expect(api.addVideo({ src: 'ftp://x/y.mp4', titleZh: '乙', titleDe: 'B' })).rejects.toThrow('外部链接');
    await expect(api.deleteVideo(SEED_VIDEOS[0]!.id)).rejects.toThrow('内置');

    await api.register({ email: 'b@b.cn', password: 'otter2026' });
    expect(await api.listVideos()).toHaveLength(SEED_VIDEOS.length);
  });
});
