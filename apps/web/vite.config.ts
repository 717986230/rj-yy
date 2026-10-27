import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';

const commit = (() => {
  try {
    return (process.env.GITHUB_SHA ?? execSync('git rev-parse HEAD').toString()).trim().slice(0, 7);
  } catch {
    return 'dev';
  }
})();
const built = new Date().toISOString().slice(5, 16).replace('T', ' ');

// base: './' 让构建产物可以部署在任意子路径下（GitHub Pages 的 /<repo>/）
export default defineConfig({
  base: './',
  // 页面上显示的版本号：用来确认手机拿到的是不是最新构建
  define: { __APP_VERSION__: JSON.stringify(`${commit} · ${built} UTC`) },
  server: { port: 5173 },
  build: { target: 'es2022', sourcemap: true },
  test: {
    environment: 'jsdom',
  },
} as Parameters<typeof defineConfig>[0]);
