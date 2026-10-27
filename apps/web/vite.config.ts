import { defineConfig } from 'vite';

// base: './' 让构建产物可以部署在任意子路径下（GitHub Pages 的 /<repo>/）
export default defineConfig({
  base: './',
  server: { port: 5173 },
  build: { target: 'es2022', sourcemap: true },
  test: {
    environment: 'jsdom',
  },
} as Parameters<typeof defineConfig>[0]);
