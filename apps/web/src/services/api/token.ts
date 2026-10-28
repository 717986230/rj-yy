import { HANDBOOK } from '../../app/site';
import { storage } from '../../app/storage';

const KEY = 'vido.token';
/** 德语学习手册存登录令牌的键（原样字符串，不是 JSON） */
const HANDBOOK_KEY = 'acct_token';

const raw = {
  get: () => {
    try {
      return localStorage.getItem(HANDBOOK_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(HANDBOOK_KEY, token);
    } catch {
      /* ignore */
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(HANDBOOK_KEY);
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
