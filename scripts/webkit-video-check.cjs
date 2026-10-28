// 在 Playwright WebKit（iPhone 13 设备参数）里检查卡片内的视频是否真的画出了画面：
// 截取 <video> 所在区域的屏幕像素算平均亮度，同时记录已解码帧数。用法：node webkit-video-check.cjs <站点地址> <截图目录>
const { webkit, devices } = require('playwright');
const { PNG } = require('pngjs');
const BASE = process.argv[2], OUT = process.argv[3] || '.';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const lum = (buf) => {
  const png = PNG.sync.read(buf);
  let sum = 0;
  for (let i = 0; i < png.data.length; i += 4) sum += png.data[i] + png.data[i + 1] + png.data[i + 2];
  return Math.round(sum / (png.data.length / 4) / 3);
};
(async () => {
  const b = await webkit.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13'] });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('pageerror', e.message));
  await p.goto(BASE, { waitUntil: 'load' });
  await sleep(800);
  if (await p.locator('[data-ref="later"]').isVisible()) await p.click('[data-ref="later"]');
  await p.goto(BASE + '#/register'); await sleep(400);
  await p.fill('#reg-email', 'webkit@example.com'); await p.fill('#reg-password', 'otter2026'); await p.fill('#reg-confirm', 'otter2026');
  await p.click('button[data-ref=submit]'); await sleep(1500);
  console.log('url', p.url());
  const report = async (name) => {
    const box = await p.locator('video').boundingBox();
    const shot = await p.screenshot({ clip: { x: box.x + 4, y: box.y + box.height * 0.15, width: box.width - 8, height: box.height * 0.45 } });
    require('fs').writeFileSync(`${OUT}/${name}.png`, shot);
    const s = await p.evaluate(() => {
      const v = document.querySelector('video');
      const q = v.getVideoPlaybackQuality?.();
      return { src: v.currentSrc.split('/').pop().slice(0, 40), t: +v.currentTime.toFixed(2), paused: v.paused, muted: v.muted, frames: q ? q.totalVideoFrames : null, w: v.videoWidth, canvas: !!document.querySelector('[data-ref=mirror]:not([hidden])') };
    });
    console.log(`RESULT ${name}: screen-lum=${lum(shot)} ${JSON.stringify(s)}`);
  };
  await p.tap('[data-ref="back"]'); await sleep(5000);
  await report('1-first-card');
  await sleep(3000);
  await report('2-first-card-later');
  await p.click('[data-mode="sequential"]');
  await p.click('[data-ref=next]'); await sleep(6000);
  await report('3-second-card');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
