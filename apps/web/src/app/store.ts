type Listener<T> = (state: T, prev: T) => void;

/** 小型可订阅状态容器 */
export class Store<T extends object> {
  private listeners = new Set<Listener<T>>();

  constructor(private state: T) {}

  get(): T {
    return this.state;
  }

  set(patch: Partial<T> | ((s: T) => Partial<T>)): void {
    const prev = this.state;
    const next = typeof patch === 'function' ? patch(prev) : patch;
    this.state = { ...prev, ...next };
    this.listeners.forEach((l) => l(this.state, prev));
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
