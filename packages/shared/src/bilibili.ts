/**
 * 哔哩哔哩视频：B 站不提供可直接播放的视频文件，只能用官方嵌入播放器（iframe）播放。
 * 片库里用标准视频页地址 https://www.bilibili.com/video/<BV号>/?p=<集数> 表示一集。
 */
export interface BilibiliRef {
  bvid?: string;
  aid?: string;
  /** 分 P 序号，从 1 开始 */
  page: number;
}

const BV = /\b(BV1[0-9A-Za-z]{9})\b/;
const AV = /(?:^|[/=])av(\d{1,20})\b/i;

/** 从 B 站视频页、手机页、嵌入播放器地址或单独的 BV 号里取出视频编号和集数；不是 B 站视频时返回 null */
export function parseBilibili(input: string): BilibiliRef | null {
  const text = input.trim();
  if (!text) return null;
  let url: URL | null = null;
  try {
    url = new URL(text);
  } catch {
    // 不是完整链接：允许直接粘贴 BV 号
  }
  if (url) {
    const host = url.hostname.replace(/^www\.|^m\./, '');
    if (host !== 'bilibili.com' && host !== 'player.bilibili.com') return null;
  }
  const page = Math.max(1, Number.parseInt(url?.searchParams.get('p') ?? '1', 10) || 1);
  const bvid = url?.searchParams.get('bvid') ?? text.match(BV)?.[1];
  if (bvid && BV.test(bvid)) return { bvid, page };
  const aid = url?.searchParams.get('aid') ?? (url ? url.pathname : text).match(AV)?.[1];
  return aid && /^\d+$/.test(aid) ? { aid, page } : null;
}

/** 片库里保存的标准地址 */
export function bilibiliPageUrl(ref: BilibiliRef): string {
  const id = ref.bvid ?? `av${ref.aid}`;
  return `https://www.bilibili.com/video/${id}/${ref.page > 1 ? `?p=${ref.page}` : ''}`;
}

/** 官方嵌入播放器地址 */
export function bilibiliEmbedUrl(ref: BilibiliRef, { autoplay = true } = {}): string {
  // isOutside=true：B 站官方分享的嵌入代码带这个参数，表示在 B 站以外的网站播放，缺了它外站常常只显示黑屏
  const q = new URLSearchParams({ isOutside: 'true' });
  if (ref.bvid) q.set('bvid', ref.bvid);
  else q.set('aid', ref.aid!);
  q.set('p', String(ref.page));
  q.set('high_quality', '1');
  q.set('danmaku', '0');
  q.set('autoplay', autoplay ? '1' : '0');
  return `https://player.bilibili.com/player.html?${q}`;
}

export const isBilibili = (src: string): boolean => parseBilibili(src) !== null && /^https?:/i.test(src);

/** b23.tv 短链接需要跳转才能知道是哪个视频，静态网站做不到，请用户粘贴完整地址 */
export const isB23Short = (input: string): boolean => /(^|\/\/)b23\.tv\//i.test(input.trim());
