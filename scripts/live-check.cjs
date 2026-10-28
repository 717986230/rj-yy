// 线上全链路检查：Cloudflare 上的 API + GitHub Pages 上的网站（在 GitHub Actions 里跑，沙盒连不上外网）
// 用法：API=https://vido-api.xxx.workers.dev/api SITE=https://717986230.github.io/rj-yy/ node scripts/live-check.cjs
const { chromium } = require('playwright');

const API = process.env.API.replace(/\/$/, '');
const SITE = process.env.SITE;
const ORIGIN = new URL(SITE).origin;
// 固定的检查专用账号，避免每次都在数据库里留下新用户
const EMAIL = 'live-check@vido.app';
const PASSWORD = 'livecheck2026';

let failed = 0;
const ok = (cond, label, extra = '') => {
  console.log(`${cond ? '✅' : '❌'} ${label}${extra ? ` — ${extra}` : ''}`);
  if (!cond) failed++;
};

async function call(method, path, { body, token, headers = {} } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Origin: ORIGIN,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = text;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, body: json, headers: res.headers };
}

async function apiChecks() {
  console.log('\n== API ==');
  const health = await call('GET', '/health');
  ok(health.status === 200 && health.body.ok, '健康检查');

  const pre = await call('OPTIONS', '/videos', { headers: { 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'authorization' } });
  ok(pre.headers.get('access-control-allow-origin') === ORIGIN, '网站域名允许跨域', pre.headers.get('access-control-allow-origin') ?? '无');

  let login = await call('POST', '/auth/login', { body: { email: EMAIL, password: PASSWORD } });
  if (login.status === 401) {
    login = await call('POST', '/auth/register', { body: { email: EMAIL, password: PASSWORD, name: '线上检查' } });
    ok(login.status === 201, '注册（users 表）', String(login.status));
  } else ok(login.status === 200, '登录（users 表）', String(login.status));
  const token = login.body.token;

  ok((await call('POST', '/auth/register', { body: { email: EMAIL, password: PASSWORD } })).status === 409, '重复注册被拒');
  ok((await call('POST', '/auth/login', { body: { email: EMAIL, password: 'wrong-pass-1' } })).status === 401, '错误密码被拒');
  const me = await call('GET', '/auth/me', { token });
  ok(me.body.email === EMAIL, '读取当前用户');
  ok((await call('GET', '/videos')).status === 401, '未登录不能看片库');
  ok((await call('GET', '/auth/me', { token: token + 'x' })).status === 401, '伪造令牌被拒');
  const reset = await call('POST', '/auth/reset', { body: { token: 'bogus', password: 'newpass99' } });
  ok(reset.status === 400, '无效重置令牌被拒（password_resets 表）', String(reset.status));
  const forgot = await call('POST', '/auth/forgot', { body: { email: EMAIL } });
  ok(forgot.status === 200 && !forgot.body.devToken, '找回密码不泄露令牌');

  const list = await call('GET', '/videos', { token });
  ok(Array.isArray(list.body) && list.body.length > 10, '片库列表', `${list.body.length} 部`);
  const seed = list.body.find((v) => v.ownerId === null);
  ok((await call('GET', `/videos/${seed.id}`, { token })).body.id === seed.id, '读取内置视频');
  ok((await call('DELETE', `/videos/${seed.id}`, { token })).status === 403, '内置视频不能删');

  const added = await call('POST', '/videos', {
    token,
    body: { titleZh: '线上检查', titleDe: 'Live-Check', src: 'https://example.com/live-check.mp4', subtitlesZh: '1\n00:00:01,000 --> 00:00:02,000\n你好\n' },
  });
  ok(added.status === 201, '添加视频（videos 表）', String(added.status));
  const vtt = await call('GET', `/videos/${added.body.id}/subtitles/zh.vtt`, { token });
  ok(String(vtt.body).includes('你好'), '字幕导出 VTT');
  const after = await call('GET', '/videos', { token });
  ok(after.body.some((v) => v.id === added.body.id && v.hasSubtitles), '新视频出现在片库');
  ok((await call('DELETE', `/videos/${added.body.id}`, { token })).status === 204, '删除自己的视频');
  ok(!(await call('GET', '/videos', { token })).body.some((v) => v.id === added.body.id), '删除后从片库消失');
  const bad = await call('POST', '/videos', { token, body: { titleZh: 'x', titleDe: 'x', src: 'javascript:alert(1)' } });
  ok(bad.status === 400, '非法链接被拒');
}

async function siteChecks() {
  console.log('\n== 网站 ==');
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome', args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const apiCalls = [];
  page.on('response', (r) => r.url().startsWith(API) && apiCalls.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`));
  await page.addInitScript(() => localStorage.setItem('vido.welcomed', 'true'));

  await page.goto(SITE + '#/login');
  await page.waitForSelector('#login-email');
  ok((await page.locator('text=已连接 Vido 服务器').count()) > 0, '网站连上云端后端（不是本地模式）');
  await page.fill('#login-email', EMAIL);
  await page.fill('#login-password', PASSWORD);
  await page.locator('#login-password').press('Enter');
  await page.waitForURL(/#\/play/, { timeout: 15000 }).catch(() => {});
  ok(page.url().includes('#/play'), '网页登录', page.url());

  await page.waitForFunction(() => !document.body.innerText.includes('片库加载中'), null, { timeout: 15000 }).catch(() => {});
  const count = await page.locator('[data-ref=backCount]').innerText().catch(() => '');
  ok(/\d+ 部/.test(count), '播放页片库', count);

  // 网页里添加一条视频
  await page.goto(SITE + '#/library');
  await page.locator('[data-ref=toggleAdd]').click();
  await page.fill('#add-src', 'https://example.com/live-check-ui.mp4');
  await page.fill('#add-title-zh', '网页添加检查');
  await page.fill('#add-title-de', 'UI-Check');
  await page.locator('form [data-ref=submit]').click();
  await page.waitForTimeout(3000);
  ok((await page.locator('text=网页添加检查').count()) > 0, '网页添加视频并显示在片库');
  await page.reload();
  await page.waitForTimeout(3000);
  ok((await page.locator('text=网页添加检查').count()) > 0, '刷新后仍在（存在云端）');

  // 清理：通过 API 删掉刚加的
  const token = await page.evaluate(() => JSON.parse(localStorage.getItem('vido.token')));
  const mine = (await call('GET', '/videos', { token })).body.filter((v) => v.ownerId);
  for (const v of mine) await call('DELETE', `/videos/${v.id}`, { token });

  // 抽卡播放
  await page.goto(SITE + '#/play');
  await page.waitForTimeout(3000);
  await page.locator('[data-ref=draw]').click();
  await page.waitForTimeout(12000);
  const playing = await page.evaluate(() =>
    [...document.querySelectorAll('video')].map((v) => ({ t: v.currentTime, src: v.currentSrc.slice(-60), err: v.error?.code ?? null })),
  );
  ok(playing.some((v) => v.t > 1), '抽卡后视频在播放', JSON.stringify(playing));
  await page.screenshot({ path: 'live-check.png' });

  ok(errors.length === 0, '页面没有脚本错误', errors.join(' | '));
  console.log('网站调用的接口：', [...new Set(apiCalls)].join(', '));
  await browser.close();
}

(async () => {
  await apiChecks();
  await siteChecks();
  console.log(failed ? `\n${failed} 项失败` : '\n全部通过');
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
