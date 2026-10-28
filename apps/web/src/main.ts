import './styles/main.css';
import { navigate, startRouter, type Route } from './app/router';
import { HANDBOOK, HANDBOOK_HOME } from './app/site';
import { app, welcome } from './app/state';
import { showWelcome } from './components/welcome';
import { forgotPage, loginPage, registerPage, resetPage } from './pages/auth';
import { libraryPage } from './pages/library';
import { playerPage } from './pages/player';
import { api, prepareApi } from './services/api';

// 在德语学习手册里打开时，注册和找回密码都交给手册
const toHandbook = () => location.assign(HANDBOOK_HOME);

const routes: Route[] = [
  { path: '/login', guestOnly: true, render: loginPage },
  { path: '/register', guestOnly: true, render: HANDBOOK ? toHandbook : registerPage },
  { path: '/forgot', render: HANDBOOK ? toHandbook : forgotPage },
  { path: '/reset', render: HANDBOOK ? toHandbook : resetPage },
  { path: '/play', auth: true, render: playerPage },
  { path: '/library', auth: true, render: libraryPage },
];

async function boot() {
  await prepareApi();
  app.set({ user: await api.me() });

  startRouter(document.getElementById('app')!, routes, {
    isAuthed: () => app.get().user !== null,
    home: '/play',
    login: '/login',
  });

  // App 第一次打开时自动弹出欢迎卡
  if (!welcome.seen()) {
    showWelcome({
      startLabel: app.get().user ? '开始抽卡' : '开始体验',
      onStart: () => {
        if (!app.get().user) document.querySelector<HTMLButtonElement>('form button[data-ref="submit"]')?.focus();
        else navigate('/play');
      },
    });
  }
}

void boot();
