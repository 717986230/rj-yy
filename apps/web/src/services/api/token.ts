import { HANDBOOK } from '../../app/site';
import { storage } from '../../app/storage';

const KEY = 'vido.token';
/** 德语学习手册存登录令牌的键（原样字符串，不是 JSON）；acct_user 是手册显示用的用户名 */
const HANDBOOK_KEY = 'acct_token';
const HANDBOOK_USER_KEY = 'acct_user';

const raw = {
  get: () => {
    try {
      return localStorage.getItem(HANDBOOK_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string, user?: { username: string; nickname?: string }) => {
    try {
      localStorage.setItem(HANDBOOK_KEY, token);
      if (user) localStorage.setItem(HANDBOOK_USER_KEY, JSON.stringify(user));
    } catch {
      /* ignore */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(HANDBOOK_KEY);
      localStorage.removeItem(HANDBOOK_USER_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const tokenStore = HANDBOOK
  ? raw
  : {
      get: () => storage.get<string | null>(KEY, null),
      set: (token: string) => storage.set(KEY, token),
      clear: () => storage.remove(KEY),
    };
