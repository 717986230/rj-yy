/**
 * Vido 有两个入口：GitHub Pages 和德语学习手册的 www.uuoo.site/vido/
 * （手册仓库定时把本站的构建同步进它的 vido/ 目录，不含 media/ 里的大视频）。
 */
export const HANDBOOK =
  typeof location !== 'undefined' && /(^|\.)uuoo\.site$/i.test(location.hostname) && location.pathname.startsWith('/vido');

/** 手册首页（顶栏 📖 按钮回这里） */
export const HANDBOOK_HOME = '/';

/** 本站自带视频（media/…）在手册里没有副本，指回 GitHub Pages 上的这一份 */
const PAGES = 'https://717986230.github.io/rj-yy/';
export const mediaUrl = (url: string) => (HANDBOOK && url.startsWith('media/') ? PAGES + url : url);
