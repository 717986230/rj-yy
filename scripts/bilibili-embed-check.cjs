// 用真实浏览器打开每张 B 站卡的官方嵌入播放器，截图看能不能播。用法：node bilibili-embed-check.cjs <截图目录> <BV 或 av 号…>
const { webkit, chromium, devices } = require('playwright');
const OUT = process.argv[2];
const ids = process.argv.slice(3);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const embed = (id) =>
  `https://player.bilibili.com/player.html?isOutside=true&${id.startsWith('av') ? `aid=${id.slice(2)}` : `bvid=${id}`}&p=1&high_quality=1&danmaku=0&autoplay=0`;
(async () => {
  for (const [name, type, opts] of [['iphone', webkit, devices['iPhone 13']], ['chrome', chromium, {}]]) {
    const b = await type.launch();
    for (const id of ids) {
      const ctx = await b.newContext(opts);
      const p = await ctx.newPage();
      const statuses = [];
      p.on('response', (r) => /playurl|view|pagelist/.test(r.url()) && statuses.push(`${r.status()} ${r.url().split('?')[0].split('/').slice(-2).join('/')}`));
      try {
        await p.goto(embed(id), { waitUntil: 'load', timeout: 30000 });
        await sleep(6000);
        const text = (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 120);
        const video = await p.evaluate(() => {
          const v = document.querySelector('video');
          return v ? { src: (v.currentSrc || v.src || '').slice(0, 40), dur: v.duration } : null;
        });
        await p.screenshot({ path: `${OUT}/${name}-${id}.png` });
        console.log(`RESULT ${name} ${id}: video=${JSON.stringify(video)} text="${text}" api=[${statuses.join(', ')}]`);
      } catch (e) {
        console.log(`RESULT ${name} ${id}: error ${e.message.split('\n')[0]}`);
      }
      await ctx.close();
    }
    await b.close();
  }
})();
