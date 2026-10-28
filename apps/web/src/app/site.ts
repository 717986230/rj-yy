/**
 * Vido 有两个入口：GitHub Pages（独立账号）和德语学习手册的 www.uuoo.site/vido/
 * （手册仓库定时把本站的构建同步进它的 vido/ 目录，不含 media/ 里的大视频）。
 * 在手册里打开时，账号直接用手册的（同域，共用 localStorage 里的 acct_token）。
 */
export const HANDBOOK =
  typeof location !== 'undefined' && /(^|\.)uuoo\.site$/i.test(location.hostname) && location.pathname.startsWith('/vido');

/** 手册的账号后端（登录、登出） */
export const HANDBOOK_API = 'https://uuoo-analytics.uuoo.workers.dev';
/** 手册里的页面（哈希路由） */
export const handbookPage = (path = '') => `/#${path}`;

/** 本站自带视频（media/…）在手册里没有副本，指回 GitHub Pages 上的这一份 */
const PAGES = 'https://717986230.github.io/rj-yy/';
export const mediaUrl = (url: string) => (HANDBOOK && url.startsWith('media/') ? PAGES + url : url);
