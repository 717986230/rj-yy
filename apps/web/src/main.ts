import './styles/main.css';
import { navigate, startRouter, type Route } from './app/router';
import { app, welcome } from './app/state';
import { showWelcome } from './components/welcome';
import { libraryPage } from './pages/library';
import { playerPage } from './pages/player';
import { api, prepareApi } from './services/api';
import { startCloudSync } from './services/cloud';

// 不需要登录：打开就能抽卡
const routes: Route[] = [
  { path: '/play', render: playerPage },
  { path: '/library', render: libraryPage },
];

async function boot() {
  await prepareApi();
  app.set({ user: await api.me() });
  // 在手册里登录过的人：隐藏的卡片、自己加的视频跟着手册账号走（不等它，先让页面出来）
  void startCloudSync();

  startRouter(document.getElementById('app')!, routes, {
    isAuthed: () => true,
    home: '/play',
    login: '/play',
  });

  // App 第一次打开时自动弹出欢迎卡
  if (!welcome.seen()) {
    showWelcome({
      startLabel: '开始抽卡',
      onStart: () => navigate('/play'),
    });
  }
}

void boot();
