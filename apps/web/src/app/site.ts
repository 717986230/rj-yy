/**
 * Vido 有两个入口：GitHub Pages（独立账号）和德语学习手册的 www.uuoo.site/vido/。
 * 在手册里打开时，API 走同域的 /vido/api，账号直接用手册的（共用 localStorage 里的 acct_token）。
 */
export const HANDBOOK =
  typeof location !== 'undefined' && /(^|\.)uuoo\.site$/i.test(location.hostname) && location.pathname.startsWith('/vido');

/** 手册的账号后端（登录、登出） */
export const HANDBOOK_API = 'https://uuoo-analytics.uuoo.workers.dev';
/** 手册里的页面（哈希路由） */
export const handbookPage = (path = '') => `/#${path}`;
