/** localStorage 的安全封装：隐私模式或被禁用时退化为内存存储 */
const memory = new Map<string, string>();

function backend(): Storage | null {
  try {
    const s = window.localStorage;
    const k = '__vido_probe__';
    s.setItem(k, '1');
    s.removeItem(k);
    return s;
  } catch {
    return null;
  }
}

const ls = typeof window === 'undefined' ? null : backend();

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = ls ? ls.getItem(key) : (memory.get(key) ?? null);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown): void {
    const raw = JSON.stringify(value);
    try {
      if (ls) ls.setItem(key, raw);
      else memory.set(key, raw);
    } catch {
      memory.set(key, raw);
    }
  },
  remove(key: string): void {
    try {
      ls?.removeItem(key);
    } catch {
      /* ignore */
    }
    memory.delete(key);
  },
};
