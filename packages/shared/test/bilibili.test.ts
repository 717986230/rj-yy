import { describe, expect, it } from 'vitest';
import { bilibiliEmbedUrl, bilibiliPageUrl, isB23Short, isBilibili, parseBilibili } from '../src';

describe('parseBilibili', () => {
  it('reads BV id and part from desktop, mobile and embed links', () => {
    expect(parseBilibili('https://www.bilibili.com/video/BV19V411q7tM/?p=3&spm_id_from=x')).toEqual({ bvid: 'BV19V411q7tM', page: 3 });
    expect(parseBilibili('https://m.bilibili.com/video/BV1RT411z7xd')).toEqual({ bvid: 'BV1RT411z7xd', page: 1 });
    expect(parseBilibili('https://player.bilibili.com/player.html?bvid=BV13u4y137e2&p=2')).toEqual({ bvid: 'BV13u4y137e2', page: 2 });
    expect(parseBilibili('BV15Z4y1G76Q')).toEqual({ bvid: 'BV15Z4y1G76Q', page: 1 });
    expect(parseBilibili('https://www.bilibili.com/video/av801477868/?p=4')).toEqual({ aid: '801477868', page: 4 });
  });

  it('rejects other sites and short links', () => {
    expect(parseBilibili('https://example.com/video/BV19V411q7tM')).toBeNull();
    expect(parseBilibili('https://cdn.example.com/movie.mp4')).toBeNull();
    expect(isBilibili('media/otti-intro-de.mp4')).toBe(false);
    expect(isB23Short('https://b23.tv/abc123')).toBe(true);
  });

  it('builds page and embed urls', () => {
    expect(bilibiliPageUrl({ bvid: 'BV19V411q7tM', page: 2 })).toBe('https://www.bilibili.com/video/BV19V411q7tM/?p=2');
    expect(bilibiliPageUrl({ aid: '801477868', page: 1 })).toBe('https://www.bilibili.com/video/av801477868/');
    expect(bilibiliEmbedUrl({ bvid: 'BV19V411q7tM', page: 2 })).toBe(
      'https://player.bilibili.com/player.html?isOutside=true&bvid=BV19V411q7tM&p=2&high_quality=1&danmaku=0&autoplay=1',
    );
  });
});
