import { storage } from '../../app/storage';

const KEY = 'vido.token';

export const tokenStore = {
  get: () => storage.get<string | null>(KEY, null),
  set: (token: string) => storage.set(KEY, token),
  clear: () => storage.remove(KEY),
};
